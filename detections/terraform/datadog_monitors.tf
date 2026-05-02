# Public-safe Terraform-style Datadog monitor examples.
# Replace placeholder notification channels and provider settings in a private lab.

resource "datadog_monitor" "test_harness_pipeline_health" {
  name    = "CloudSec Test Harness - Pipeline Health"
  type    = "log alert"
  query   = "logs(\"source:test-harness @synthetic:true @purpose:detection-rule-validation\").index(\"*\").rollup(\"count\").last(\"5m\") >= 1"
  message = "Synthetic detection test harness replay observed."
  tags    = ["cloudsec", "test-harness", "synthetic", "pipeline-health"]

  include_tags      = true
  notify_no_data    = false
  renotify_interval = 0
}

resource "datadog_monitor" "identity_account_takeover" {
  name    = "CloudSec Test Harness - Identity Account Takeover"
  type    = "log alert"
  query   = "logs(\"source:test-harness @synthetic:true @purpose:detection-rule-validation @scenario:identity_account_takeover\").index(\"*\").rollup(\"count\").last(\"10m\") >= 1"
  message = "Synthetic identity account takeover replay observed."
  tags    = ["cloudsec", "test-harness", "synthetic", "identity-account-takeover"]

  include_tags      = true
  notify_no_data    = false
  renotify_interval = 0
}

resource "datadog_monitor" "aws_credential_misuse" {
  name    = "CloudSec Test Harness - AWS Credential Misuse"
  type    = "log alert"
  query   = "logs(\"source:test-harness @synthetic:true @purpose:detection-rule-validation @scenario:aws_iam_key_misuse\").index(\"*\").rollup(\"count\").last(\"10m\") >= 1"
  message = "Synthetic AWS credential misuse replay observed."
  tags    = ["cloudsec", "test-harness", "synthetic", "aws-iam-key-misuse"]

  include_tags      = true
  notify_no_data    = false
  renotify_interval = 0
}

resource "datadog_monitor" "eks_secret_access_chain" {
  name    = "CloudSec Test Harness - EKS Secret Access Chain"
  type    = "log alert"
  query   = "logs(\"source:test-harness @synthetic:true @purpose:detection-rule-validation @scenario:eks_secret_access_chain\").index(\"*\").rollup(\"count\").last(\"10m\") >= 1"
  message = "Synthetic EKS workload secret access replay observed."
  tags    = ["cloudsec", "test-harness", "synthetic", "eks-secret-access-chain"]

  include_tags      = true
  notify_no_data    = false
  renotify_interval = 0
}

resource "datadog_monitor" "endpoint_to_mongodb_pivot" {
  name    = "CloudSec Test Harness - Endpoint To MongoDB Pivot"
  type    = "log alert"
  query   = "logs(\"source:test-harness @synthetic:true @purpose:detection-rule-validation @scenario:endpoint_to_mongodb_pivot\").index(\"*\").rollup(\"count\").last(\"10m\") >= 1"
  message = "Synthetic endpoint to MongoDB pivot replay observed."
  tags    = ["cloudsec", "test-harness", "synthetic", "endpoint-to-mongodb-pivot"]

  include_tags      = true
  notify_no_data    = false
  renotify_interval = 0
}

resource "datadog_monitor" "s3_data_access_exfiltration" {
  name    = "CloudSec Test Harness - S3 Data Access Exfiltration"
  type    = "log alert"
  query   = "logs(\"source:test-harness @synthetic:true @purpose:detection-rule-validation @scenario:s3_data_access_exfiltration\").index(\"*\").rollup(\"count\").last(\"10m\") >= 1"
  message = "Synthetic S3 data access and exfiltration replay observed."
  tags    = ["cloudsec", "test-harness", "synthetic", "s3-data-access-exfiltration"]

  include_tags      = true
  notify_no_data    = false
  renotify_interval = 0
}

