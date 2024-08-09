locals {
  service      = "tea"
  init_command = ["/bin/sh", "-c", "npx sequelize-cli db:migrate"]
}
