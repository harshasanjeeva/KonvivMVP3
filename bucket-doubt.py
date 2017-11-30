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

engine = create_engine('mysql+mysqlconnector://user:varshaA1!@konvivtest1.c0ebjxhggelq.us-east-2.rds.amazonaws.com/testSchema',echo=False)
       # name of the data base
conn = pymysql.connect(host="konvivtest1.c0ebjxhggelq.us-east-2.rds.amazonaws.com", port=3306, user="harsha", passwd="varshaA1!", db="testSchema")
# you must create a Cursor object. It will let
#  you execute all the queries you need
cur = db.cursor()

# Use all the SQL you like
cur.execute("SELECT * FROM transactionTable")

# print all the first cell of all the rows
for row in cur.fetchall():
    print("the data - ",row[3] ,"-" , row[1],"-", row[2]," ", row[4]," ", row[0])

df = pd.read_sql("SELECT * FROM transactionTable", con=db)data=[[2500,'Rent',200,100,1000,10]]
df1_db = pd.DataFrame(data,columns=['Category','Amount','bucket','bucket_fill','rem_income','id']);

# # doubt=====================================================??????????????????????????????????????/////////////////////////////////////

result.to_sql(con=engine, name='bucketFillTest', if_exists='append',flavor=None, index=False, chunksize=10000)
# df1_db.to_sql(con=conn, name='bucketFillTest', if_exists='replace', flavor='mysql', index=False, chunksize=10000)
conn.close()
db.close()