# Portfolio Contact Form Security Guide

## 🛡️ Security Measures Implemented

### 1. Rate Limiting
- **Per IP Limit**: 10 requests per hour
- **Implementation**: Lambda function memory-based tracking
- **Action**: Returns 429 status code when exceeded

### 2. Input Validation
- **Email Validation**: RFC-compliant email format
- **Content Filtering**: Blocks suspicious patterns:
  - Script tags (`<script>`)
  - JavaScript protocols (`javascript:`)
  - Event handlers (`onclick=`, etc.)
  - Common spam keywords
- **Length Limits**:
  - Name: 100 characters
  - Subject: 200 characters
  - Message: 2000 characters
  - Email: 100 characters

### 3. Monitoring & Alerts

#### CloudWatch Alarms
- **High Volume**: Alert when >50 emails sent per hour
- **Error Rate**: Alert when Lambda error rate >10%
- **4XX Errors**: Alert when API Gateway 4XX errors >20

#### Real-time Monitoring
```bash
# Check security status
./monitoring/monitor.sh

# Block malicious IP
./security/block-ip.sh <IP_ADDRESS>
```

### 4. WAF Protection (Optional)
- **Rate Limiting**: 100 requests per 5 minutes per IP
- **Geographic Blocking**: Block specific countries
- **SQL Injection Protection**: AWS managed rules
- **Known Bad IPs**: Customizable IP blocklist

## 🚨 Security Incident Response

### Automatic Responses
1. **Rate Limit Exceeded**: Request blocked with 429 status
2. **Suspicious Input**: Request blocked with 400 status
3. **Invalid Email**: Request blocked with 400 status

### Manual Responses
1. **Check monitoring**: `./monitoring/monitor.sh`
2. **Review logs**: Check CloudWatch for patterns
3. **Block IP**: `./security/block-ip.sh <malicious-ip>`
4. **Update filters**: Modify validation patterns in Lambda

## 📊 Cost Monitoring

### Free Tier Limits
- **Lambda**: 1M requests/month (FREE)
- **API Gateway**: 1M requests/month (FREE)
- **SES**: 200 emails/day from Lambda (FREE)
- **CloudWatch**: Basic monitoring (FREE)

### Paid Services
- **WAF**: ~$5/month + $0.60 per million requests
- **Enhanced CloudWatch**: $0.30 per alarm per month

### Cost Alerts
Set up billing alerts in AWS console:
1. Go to AWS Billing Dashboard
2. Create budget alert for >$10/month
3. Add email notification

## 🔧 Maintenance Tasks

### Weekly
- [ ] Run `./monitoring/monitor.sh`
- [ ] Check email for security alerts
- [ ] Review CloudWatch metrics

### Monthly
- [ ] Review AWS billing for unexpected charges
- [ ] Update bad IP list if needed
- [ ] Check for Lambda function updates

### As Needed
- [ ] Add new validation patterns
- [ ] Update rate limits based on usage
- [ ] Block malicious IPs

## 📞 Emergency Response

### If Under Attack
1. **Immediate**: Run `./security/block-ip.sh <attacker-ip>`
2. **If WAF deployed**: Check WAF blocked requests
3. **High volume**: Temporarily reduce rate limits
4. **Severe**: Disable Lambda function temporarily:
   ```bash
   aws lambda put-function-configuration \
     --function-name portfolio-contact-api-contact-handler \
     --environment Variables='{DISABLED=true}'
   ```

### Recovery
1. **Analyze**: Review logs and attack patterns
2. **Update**: Improve validation rules
3. **Monitor**: Watch for repeat attacks
4. **Re-enable**: Remove temporary restrictions

## 📧 Contact for Security Issues

If you detect any security vulnerabilities:
1. Check monitoring scripts first
2. Review CloudWatch logs
3. Implement temporary blocks if needed
4. Update security rules accordingly

## 🔄 Regular Updates

Keep your security measures current:
- Monitor AWS security bulletins
- Update Lambda runtime versions
- Review and update validation patterns
- Test security measures quarterly