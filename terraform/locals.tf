locals {
  service            = "tea"
  db_secret_password = jsondecode(data.aws_secretsmanager_secret_version.db_secret_version.secret_string)["password"]
}
