resource "aws_db_instance" "fitcal-rds" {
  identifier = var.rds.instance.identifier
  db_name = var.rds.instance.db_name
  engine = var.rds.instance.engine
  engine_version = var.rds.instance.engine_version
  instance_class = var.rds.instance.instance_class
  allocated_storage = var.rds.instance.allocated_storage
  parameter_group_name = aws_db_parameter_group.fitcal-rds-pg.name
  db_subnet_group_name = aws_db_subnet_group.fitcal-rds-subnet-group.name
  vpc_security_group_ids = [aws_security_group.fitcalapp-security-groups["rds-sg"].id]
  deletion_protection = var.rds.instance.deletion_protection
  username = var.rds.instance.username
  manage_master_user_password = var.rds.instance.manage_master_user_password
  multi_az = var.rds.instance.multi_az
  skip_final_snapshot = var.rds.instance.skip_final_snapshot
  apply_immediately = var.rds.instance.apply_immediately
}


resource "aws_db_parameter_group" "fitcal-rds-pg" {
  name = var.rds.parameter_group.name
  family = var.rds.parameter_group.family
}


resource "aws_db_subnet_group" "fitcal-rds-subnet-group" {
  name = var.rds.subnet_group.name
  subnet_ids = [ aws_subnet.fitcalapp-private-subnet["private_subnet_1"].id, aws_subnet.fitcalapp-private-subnet["private_subnet_2"].id ]
}