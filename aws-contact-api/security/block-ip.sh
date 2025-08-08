#!/bin/bash

# Script to automatically block malicious IPs
# Usage: ./block-ip.sh <IP_ADDRESS>

REGION="us-east-1"
IP_SET_NAME="BadIPs"
IP_SET_ID=""

if [ $# -eq 0 ]; then
    echo "Usage: $0 <IP_ADDRESS>"
    echo "Example: $0 192.168.1.1"
    exit 1
fi

IP_ADDRESS="$1"

# Validate IP address format
if [[ ! $IP_ADDRESS =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]; then
    echo "❌ Invalid IP address format: $IP_ADDRESS"
    exit 1
fi

echo "🚫 Blocking IP address: $IP_ADDRESS"

# Find the IP Set ID
IP_SET_ID=$(aws wafv2 list-ip-sets --scope REGIONAL --region $REGION \
    --query "IPSets[?Name=='$IP_SET_NAME'].Id" --output text)

if [ -z "$IP_SET_ID" ]; then
    echo "❌ IP Set '$IP_SET_NAME' not found. Please deploy WAF rules first."
    exit 1
fi

# Get current IP list
CURRENT_IPS=$(aws wafv2 get-ip-set --scope REGIONAL --region $REGION \
    --id $IP_SET_ID --query 'IPSet.Addresses' --output json)

# Add new IP to the list
NEW_IPS=$(echo $CURRENT_IPS | jq --arg ip "$IP_ADDRESS/32" '. + [$ip] | unique')

# Get lock token
LOCK_TOKEN=$(aws wafv2 get-ip-set --scope REGIONAL --region $REGION \
    --id $IP_SET_ID --query 'LockToken' --output text)

# Update IP Set
aws wafv2 update-ip-set \
    --scope REGIONAL \
    --region $REGION \
    --id $IP_SET_ID \
    --addresses "$NEW_IPS" \
    --lock-token $LOCK_TOKEN

if [ $? -eq 0 ]; then
    echo "✅ Successfully blocked IP: $IP_ADDRESS"
    echo "📧 Sending notification..."
    
    # Send notification (optional)
    aws sns publish \
        --region $REGION \
        --topic-arn "arn:aws:sns:$REGION:$(aws sts get-caller-identity --query Account --output text):portfolio-security-alerts" \
        --message "🚫 IP Address Blocked: $IP_ADDRESS has been added to the WAF block list due to malicious activity." \
        --subject "Security Alert: IP Blocked" 2>/dev/null || echo "Note: SNS notification not configured"
else
    echo "❌ Failed to block IP: $IP_ADDRESS"
    exit 1
fi