import warnings
import pandas as pd
import numpy as np
import datetime as dt
import sys
import MySQLdb as MySQLdb

db = MySQLdb.connect(host="konvivtest1.c0ebjxhggelq.us-east-2.rds.amazonaws.com",    # your host, usually localhost
                     user="harsha",         # your username
                     password="varshaA1!",  # your password
                     database="testSchema")        # name of the data base

# you must create a Cursor object. It will let
#  you execute all the queries you need
cur = db.cursor()

# Use all the SQL you like
cur.execute("SELECT * FROM transactionTable")

# print all the first cell of all the rows
# for row in cur.fetchall():
#     print("the data - ",row[3] ,"-" , row[1],"-", row[2]," ", row[4]," ", row[0])

df = pd.read_sql("SELECT * FROM transactionTable", con=db)
#df = df.to_sql(name='SQL Table name',con=engine,if_exists='append',index=False) 

db.close()

# print(sys.argv)
# hello = sys.argv[0]


# lines = "alsjndjn";
# #Read data from stdin

# lines = sys.stdin.readlines()
# print(lines)
startingFunds = float(sys.argv[1])

file = open('testfile.txt','r+') 
 
file.write("startingFunds") 

 
file.close() 
# Since our input would only be having one line, parse our JSON data from that




# data=[['Rent',1500],['Food',50],['Bills',100],['Car',100],['Shopping',150],['Others','150']]
# warnings.filterwarnings('ignore')
# df = df[['category','amount']]
# print(df)
# df1 = pd.DataFrame(data,columns=['Category','Amount']);
# print(df1);
# df2 = df1.copy()
# df = df2;

# # Acts as goto statement
# def goto(linenum):
#     global line
#     line = linenum
# # Intialisation of the income
# income = 2000;
# line = 0;
# print("income",income)

# Category for the Rent
# df_rent= df[df['Category'].str.contains("Rent")];
# df_rent.loc[:,'bucket'] = df_rent['Amount'];
# if float(df_rent['bucket']) <= float(income):
#     print("your income is good");
#     df_rent.loc[:,'bucket_fill'] = df_rent['bucket'];
#     df_rent.loc[:,'Amount'] = income;
#     df_rent.loc[:,'rem_income'] = income - df_rent['bucket_fill'];
#     print(df_rent)
#     line=0
# else:
#     print("Your income is insufficient")
#     line = 1
# goto(line)




# # Category for the Bills
# if line!=1:
#     df_bills = df[df['Category'].str.contains("Bil")];
#     df_bills.loc[:,'bucket'] = df_bills['Amount'];
#     df_bills.loc[:,'bucket_fill'] = df_bills['bucket'];
#     if df_rent.get_value(0,'rem_income',takeable=False) >= float(df_bills.loc[:,'bucket_fill']):
#         df_bills.loc[:,'Amount'] = df_rent.get_value(0,'rem_income',takeable=False);
#         df_bills.loc[:,'rem_income'] = df_rent.get_value(0,'rem_income',takeable=False) - df_bills['bucket_fill'];
#         print(df_bills)
#         line = 0
#     else:
#         print("Your income is insufficient")
#         line = 1
# goto(line)
        
# # x + y < rem income
# # 
# # 
# # Category for the Shop
# if line!=1:
#     df_shop = df[df['Category'].str.contains("Shop")];
#     df_shop.loc[:,'bucket'] = df_shop['Amount'];
#     df_food = df[df['Category'].str.contains("Foo")];
#     df_food.loc[:,'bucket'] = df_food['Amount'];
#     df_math =  float(df_food.loc[:,'bucket']) + float(df_shop.loc[:,'bucket'])
#     if df_math < float( df_bills.loc[:,'rem_income']):
#         print("df_math")
#         print (df_math)
#         df_shop.loc[:,'bucket_fill'] = df_shop['bucket'];
#         # if df_bills.loc[2,'rem_income'] >= float(df_shop.loc[:,'bucket_fill']):
#         print("Your income is good!")
#         df_shop.loc[:,'Amount'] = df_bills.loc[2,'rem_income'];
#         df_shop.loc[:,'rem_income'] = df_bills.loc[2,'rem_income'] - df_shop['bucket_fill'];
#         print(df_shop)
#         # else:
#         #     print("your income is insufficient")
#         #     line=1
#         # goto(line)
#         # Category for the Food
#         if line!=1:
#             df_food.loc[:,'bucket_fill'] = df_food['bucket'];
#             # if df_food.loc[1,'rem_income'] >= float(df_food.loc[:,'bucket_fill']):
#             print("Your income is good!")
#             print(df_food)
#             df_food.loc[:,'Amount'] = df_shop.loc[4,'rem_income'];
#             df_food.loc[:,'rem_income'] = df_shop.loc[4,'rem_income'] - df_food['bucket_fill'];
#             print(df_food)
#             # else:
#         #         print("your income is insufficient")
#         #         line=1
#         # goto(line)
#     else:
#         div = float( df_bills.loc[:,'rem_income']) / df_math;
#         print(div)
#         print("df_math")
#         print (df_math)
#         df_shop.loc[:,'bucket_fill'] = df_shop['bucket']*div;
#         # if df_bills.loc[2,'rem_income'] >= float(df_shop.loc[:,'bucket_fill']):
#         print("Your income is good!")
#         df_shop.loc[:,'Amount'] = df_bills.loc[2,'rem_income'];
#         df_shop.loc[:,'rem_income'] = df_bills.loc[2,'rem_income'] - df_shop['bucket_fill'];
#         print(df_shop)
#         # else:
#         #     print("your income is insufficient")
#         #     line=1
#         # goto(line)
#         # Category for the Food
#         if line!=1:
#             df_food.loc[:,'bucket_fill'] = df_food['bucket']*div;
#             # if df_food.loc[1,'rem_income'] >= float(df_food.loc[:,'bucket_fill']):
#             print("Your income is good!")
#             print(df_food)
#             df_food.loc[:,'Amount'] = df_shop.loc[4,'rem_income'];
#             df_food.loc[:,'rem_income'] = df_shop.loc[4,'rem_income'] - df_food['bucket_fill'];
#             print(df_food)
#             line=2
#             # else:
#         #         print("your income is insufficient")
#         #         line=1
#         # goto(line)

# # Category for the Others
# if line!=1:
#     df_other = df[df['Category'].str.contains("Oth")];
#     df_other.loc[:,'bucket'] = df_other['Amount'];

#     df_other.loc[:,'bucket_fill'] = float(df_other['bucket']);
#     x = df_other.loc[:,'bucket_fill']
#     if df_shop.loc[4,'rem_income'] >= float(x):
#         print("Your income is good!")
#         df_other.loc[:,'Amount'] = df_shop.loc[4,'rem_income'];
#         df_other.loc[:,'rem_income'] = float(df_shop.loc[4,'rem_income']) - float(df_other['bucket_fill']);
#         print(df_other)
#         line = 0
#     else:
#         df_other.loc[:,'Amount'] = df_shop.loc[4,'rem_income'];
#         df_other.loc[:,'rem_income'] = float(df_shop.loc[4,'rem_income']) - float(df_other['bucket_fill']);
#         df_other.loc[:,'bucket_fill'] = df_other.loc[:,'Amount']
#         print(df_other)
#         line = 0
#         print("your income is insufficient")
# goto(line)
# print(line)
# if line!=2:
#     if line!=1:
#         # Category for the Making all the dataframes into one
#         frames=[ df_rent,df_bills,df_shop,df_food,df_other]
#         result = pd.concat(frames);
#         print(result);

# if line==2:
#     # Category for the Making all the dataframes into one
#     frames=[df_rent,df_bills,df_shop,df_food]

#     result = pd.concat(frames);
#     print(result);

# # Catching the result if the income is less 
# if line ==1:
#     print("User has insufficient income")


# print("your income is good");