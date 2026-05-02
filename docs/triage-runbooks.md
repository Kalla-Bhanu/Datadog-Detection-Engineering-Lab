# Triage Runbooks

## Identity Account Takeover

1. Confirm the alert is part of the test harness data.
2. Review the modeled sign-in sequence, MFA reset signal, and privileged follow-on action.
3. Determine whether the modeled behavior represents compromise, risky access, or a false positive.
4. Document containment actions: reset session, require MFA, review privileged activity, and preserve evidence.

## AWS Credential Misuse

1. Confirm the scenario tag is `aws_iam_key_misuse`.
2. Review API sequence, source location, access-key age, and privilege changes.
3. Decide whether to disable the access key and rotate related credentials.
4. Preserve audit timeline and monitor evidence.

## EKS Secret Access Chain

1. Confirm the scenario tag is `eks_secret_access_chain`.
2. Review workload identity, assumed role, secret path, and decrypt behavior.
3. Validate whether the access is expected for the service.
4. Contain workload, rotate secret, and update trust policy if needed.

## Endpoint To MongoDB Pivot

1. Confirm the scenario tag is `endpoint_to_mongodb_pivot`.
2. Review process lineage, database client execution, collection access, and host context.
3. Decide whether host isolation is required.
4. Preserve endpoint and database timeline.

## S3 Data Access Exfiltration

1. Confirm the scenario tag is `s3_data_access_exfiltration`.
2. Review object volume, actor, client, bucket sensitivity, and timing.
3. Determine whether data exposure occurred.
4. Block access, preserve logs, and escalate to incident response.
