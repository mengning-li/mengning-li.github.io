#!/bin/bash

# Portfolio Contact Form Security Monitor
# Run this script to check for suspicious activity

REGION="us-east-1"
FUNCTION_NAME="portfolio-contact-api-contact-handler"
LOG_GROUP="/aws/lambda/portfolio-contact-api-contact-handler"

echo "🔍 Portfolio Contact Form Security Monitor"
echo "========================================"
echo ""

# Check recent email volume
echo "📧 Email Volume (Last 24 hours):"
aws ses get-send-quota --region $REGION --query 'SentLast24Hours' --output text
echo ""

# Check for rate limit violations in logs
echo "⚠️  Rate Limit Violations (Last 1 hour):"
RATE_LIMIT_COUNT=$(aws logs filter-log-events \
    --log-group-name $LOG_GROUP \
    --region $REGION \
    --start-time $(date -u -d '1 hour ago' +%s)000 \
    --filter-pattern "Rate limit exceeded" \
    --query 'length(events)' \
    --output text)

if [ "$RATE_LIMIT_COUNT" -gt 0 ]; then
    echo "🚨 $RATE_LIMIT_COUNT rate limit violations detected!"
    
    # Get the violating IPs
    echo "Violating IPs:"
    aws logs filter-log-events \
        --log-group-name $LOG_GROUP \
        --region $REGION \
        --start-time $(date -u -d '1 hour ago' +%s)000 \
        --filter-pattern "Rate limit exceeded" \
        --query 'events[*].message' \
        --output text | grep -o '[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}' | sort | uniq -c
else
    echo "✅ No rate limit violations"
fi
echo ""

# Check for suspicious input attempts
echo "🛡️  Suspicious Input Attempts (Last 1 hour):"
SUSPICIOUS_COUNT=$(aws logs filter-log-events \
    --log-group-name $LOG_GROUP \
    --region $REGION \
    --start-time $(date -u -d '1 hour ago' +%s)000 \
    --filter-pattern "Suspicious input detected" \
    --query 'length(events)' \
    --output text)

if [ "$SUSPICIOUS_COUNT" -gt 0 ]; then
    echo "🚨 $SUSPICIOUS_COUNT suspicious input attempts detected!"
else
    echo "✅ No suspicious input attempts"
fi
echo ""

# Check Lambda error rate
echo "❌ Lambda Errors (Last 1 hour):"
ERROR_COUNT=$(aws logs filter-log-events \
    --log-group-name $LOG_GROUP \
    --region $REGION \
    --start-time $(date -u -d '1 hour ago' +%s)000 \
    --filter-pattern "ERROR" \
    --query 'length(events)' \
    --output text)

if [ "$ERROR_COUNT" -gt 0 ]; then
    echo "⚠️  $ERROR_COUNT errors detected"
else
    echo "✅ No errors"
fi
echo ""

# Check API Gateway metrics
echo "🌐 API Gateway Metrics (Last 1 hour):"
API_ID="9f9oy6wbak"

# Get 4XX errors
FOUR_XX_ERRORS=$(aws cloudwatch get-metric-statistics \
    --namespace AWS/ApiGateway \
    --metric-name 4XXError \
    --dimensions Name=ApiName,Value=$API_ID \
    --start-time $(date -u -d '1 hour ago' --iso-8601) \
    --end-time $(date -u --iso-8601) \
    --period 3600 \
    --statistics Sum \
    --region $REGION \
    --query 'Datapoints[0].Sum' \
    --output text 2>/dev/null || echo "0")

echo "4XX Errors: ${FOUR_XX_ERRORS:-0}"

# Get total requests
TOTAL_REQUESTS=$(aws cloudwatch get-metric-statistics \
    --namespace AWS/ApiGateway \
    --metric-name Count \
    --dimensions Name=ApiName,Value=$API_ID \
    --start-time $(date -u -d '1 hour ago' --iso-8601) \
    --end-time $(date -u --iso-8601) \
    --period 3600 \
    --statistics Sum \
    --region $REGION \
    --query 'Datapoints[0].Sum' \
    --output text 2>/dev/null || echo "0")

echo "Total Requests: ${TOTAL_REQUESTS:-0}"
echo ""

# Summary and recommendations
echo "📊 Security Summary:"
if [ "$RATE_LIMIT_COUNT" -gt 5 ] || [ "$SUSPICIOUS_COUNT" -gt 3 ] || [ "${FOUR_XX_ERRORS:-0}" -gt 20 ]; then
    echo "🚨 HIGH RISK: Unusual activity detected!"
    echo ""
    echo "Recommended actions:"
    echo "1. Review the violating IPs and consider blocking them"
    echo "2. Check CloudWatch alarms"
    echo "3. Consider enabling WAF if not already active"
    echo "4. Monitor email costs in AWS billing"
elif [ "$RATE_LIMIT_COUNT" -gt 0 ] || [ "$SUSPICIOUS_COUNT" -gt 0 ]; then
    echo "⚠️  MEDIUM RISK: Some suspicious activity"
    echo ""
    echo "Recommended actions:"
    echo "1. Continue monitoring"
    echo "2. Review logs for patterns"
else
    echo "✅ LOW RISK: Normal activity levels"
fi

echo ""
echo "Last updated: $(date)"