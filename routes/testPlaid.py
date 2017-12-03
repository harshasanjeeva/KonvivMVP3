import warnings
import pandas as pd
import numpy as np
import datetime as dt
import sys
import MySQLdb as MySQLdb
import math
from pandas.io import sql
import mysql.connector
from sqlalchemy import create_engine
import pymysql as pymysql 

engine = create_engine('mysql+mysqlconnector://harsha:varshaA1!@konvivtest1.c0ebjxhggelq.us-east-2.rds.amazonaws.com:3306/testSchema',echo=False)
db = MySQLdb.connect(host="konvivtest1.c0ebjxhggelq.us-east-2.rds.amazonaws.com",    # your host, usually localhost
                     user="harsha",         # your username
                     password="varshaA1!",  # your password
                     database="testSchema")        # name of the data base
conn = pymysql.connect(host="konvivtest1.c0ebjxhggelq.us-east-2.rds.amazonaws.com", port=3306, user="harsha", passwd="varshaA1!", db="testSchema")
# you must create a Cursor object. It will let
#  you execute all the queries you need
cur = db.cursor()

user_id = 9066


df_income = pd.read_sql("SELECT * FROM accountsPlaidTable WHERE user_id = %(user_id1)s",params={"user_id1":user_id }, con=db)
print(df_income)

income = df_income.loc[df_income['subtype'].str.contains("che"), 'availablebalance'].item()

print("amount")
print(income)