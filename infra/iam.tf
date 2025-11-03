resource "aws_iam_role" "beanstalk-service-role" {
  name = var.iam.roles.beanstalk-service-role.name
  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "elasticbeanstalk.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
  })
}


resource "aws_iam_role_policy_attachment" "beanstalk-service-role-policy-attachment" {
  role = aws_iam_role.beanstalk-service-role.name
  for_each = toset(var.iam.roles.beanstalk-service-role.policies)
  policy_arn = each.key
}


resource "aws_iam_role" "fitcal-beanstalk-ec2-role" {
  name = var.iam.roles.beanstalk-ec2-role.name
  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
                "Service": "ec2.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
  })
}


resource "aws_iam_role_policy_attachment" "fitcal-beanstalk-ec2-role-attachment" {
  role = aws_iam_role.fitcal-beanstalk-ec2-role.name
  for_each = toset(var.iam.roles.beanstalk-ec2-role.policies)
  policy_arn = each.key
}

resource "aws_iam_instance_profile" "fitcal_beanstalk_ec2_instance_profile" {
  name = var.iam.roles.beanstalk-ec2-instance-profile.name
  role = aws_iam_role.fitcal-beanstalk-ec2-role.name
}