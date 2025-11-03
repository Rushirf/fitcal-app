resource "aws_vpc" "fitcalapp-vpc" {

  cidr_block = var.vpc_cidr
  enable_dns_hostnames = true
  tags = {
    Name = "fitcalapp-vpc"
  }

}

resource "aws_subnet" "fitcalapp-public-subnet" {

  vpc_id = aws_vpc.fitcalapp-vpc.id
  for_each = var.public_subnets
  cidr_block = each.value.cidr_block
  availability_zone = each.value.availability_zone
  map_public_ip_on_launch = each.value.map_public_ip_on_launch
  tags = {
    Name = each.value.name
  }
}


resource "aws_subnet" "fitcalapp-private-subnet" {

  vpc_id = aws_vpc.fitcalapp-vpc.id
  for_each = var.private_subnets
  cidr_block = each.value.cidr_block
  availability_zone = each.value.availability_zone
  map_public_ip_on_launch = each.value.map_public_ip_on_launch
  tags = {
    Name = each.value.name
  }
  
}


resource "aws_internet_gateway" "fitcalapp-igw" {
  vpc_id = aws_vpc.fitcalapp-vpc.id
  tags = {
    Name = "fitcalapp-igw"
  }
}


resource "aws_eip" "fitcalapp-eip" {
  tags = {
    Name = "fitcalapp-eip"
  }
}


resource "aws_nat_gateway" "fitcalapp-ngw" {
  depends_on = [ aws_internet_gateway.fitcalapp-igw ]
  subnet_id = aws_subnet.fitcalapp-public-subnet["public_subnet_1"].id
  allocation_id = aws_eip.fitcalapp-eip.id
  tags = {
    Name = "fitcalapp-ngw"
  }
}


resource "aws_route_table" "fitcalapp-public-route" {
  vpc_id = aws_vpc.fitcalapp-vpc.id
  tags = {
    Name = "fitcalapp-public-route"
  }

  route {
    cidr_block = aws_vpc.fitcalapp-vpc.cidr_block
    gateway_id = "local"
  }

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.fitcalapp-igw.id
  }

}


resource "aws_route_table" "fitcalapp-private-route" {
  vpc_id = aws_vpc.fitcalapp-vpc.id
  tags = {
    Name = "fitcalapp-private-route"
  }

  route {
    cidr_block = aws_vpc.fitcalapp-vpc.cidr_block
    gateway_id = "local"
  }

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.fitcalapp-ngw.id
  }
}


resource "aws_route_table_association" "fitcalapp-public_subnet-route-association" {
    for_each = aws_subnet.fitcalapp-public-subnet
    subnet_id = each.value.id
    route_table_id = aws_route_table.fitcalapp-public-route.id
}


resource "aws_route_table_association" "fitcalapp-private_subnet-route-association" {
    for_each = aws_subnet.fitcalapp-private-subnet
    subnet_id = each.value.id
    route_table_id = aws_route_table.fitcalapp-private-route.id
}

resource "aws_security_group" "fitcalapp-security-groups" {
  vpc_id = aws_vpc.fitcalapp-vpc.id
  for_each = var.security_groups
  name = each.value.name
  description = each.value.description

  dynamic "ingress" {
    for_each = each.value.ingress_rules
    content {
      from_port = ingress.value.from_port
      to_port = ingress.value.to_port
      protocol = ingress.value.protocol
      cidr_blocks = ingress.value.cidr_blocks
    }
  }

  dynamic "egress" {
    for_each = each.value.egress_rules
    content {
      from_port = egress.value.from_port
      to_port = egress.value.to_port
      protocol = egress.value.protocol
      cidr_blocks = egress.value.cidr_blocks
    }
  }

  tags = {
    Name = each.value.name
  }
}