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

# user_id = 4380
user_id = sys.argv[2]

# startingFunds = sys.argv[1]
# startingFunds1 = float(sys.argv[2])









# user_id10 = 7411;
# cur.execute("DELETE FROM bucketFillTest WHERE id = %(user_id1)")
# user_id = 7170
# user_id = 3029;


# Use all the SQL you like
cur.execute("SELECT * FROM transactionTable")
sql = ''' DELETE FROM bucketFillTest WHERE id = {user_id10} '''.format(user_id10 = user_id)
engine.execute(sql) 


# print all the first cell of all the rows
for row in cur.fetchall():
    print("the data - ",row[3] ,"-" , row[1],"-", row[2]," ", row[4]," ", row[0])

df = pd.read_sql("SELECT * FROM transactionsTable WHERE user_id = %(user_id1)s",params={"user_id1":user_id }, con=db)
#df = df.to_sql(name='SQL Table name',con=engine,if_exists='append',index=False) 

# db.close()
print(df)



df_income = pd.read_sql("SELECT * FROM accountsPlaidTable WHERE user_id = %(user_id1)s",params={"user_id1":user_id }, con=db)
print(df_income)

income = df_income.loc[df_income['subtype'].str.contains("che"), 'availablebalance'].item()

print("amount")
print(df_income)


data=[['Rent',1500],['Food',50],['Bills',100],['Car',100],['Shopping',150],['Others','150']]
warnings.filterwarnings('ignore')
df = df[['category','amount','date']]
print(df)
df.columns = ['Category', 'Amount','Time']
# df1 =df.copy();
# #df1 = pd.DataFrame(data,columns=['Category','Amount']);
# print(df1);
# df2 = df1.copy()
# df = df2;

# Acts as goto statement
def goto(linenum):
    global line
    line = linenum
# Intialisation of the income
# income = 30;
line = 0;
float(income)
print("income---->",income)


# df_new = pd.DataFrame(data,columns=['Category','Amount','Time'])
df_new =df.copy();

#filtering the using the date
df_new.Time = pd.to_datetime(df_new['Time'])
print("Converting the input string into date")
print(df_new);

tday = dt.date.today();
d4 = df_new[df_new.Time.dt.date > tday - pd.to_timedelta("30day")]
print("Filtering the data using the 30 day rule");
print(d4);

d4['Amount'] = d4['Amount'].abs()

print(d4)




print("Filtering for spend tracker")
spendtrack = df_new[df_new.Time.dt.date > tday - pd.to_timedelta("8day")]
print("Filtering the data using the 7 day rule");
print(spendtrack);


if not spendtrack.empty:
    spendtrack.loc[:,'id'] = user_id
    spendtrack['Amount'] = spendtrack['Amount'].abs()
    sql1 = ''' DELETE FROM spendtrackertest WHERE id = {user_id10} '''.format(user_id10 = user_id)
    engine.execute(sql1)
    print(spendtrack)
    
    spendtrack.to_sql(con=engine, name='spendtrackertest', if_exists='append',flavor=None, index=False, chunksize=10000)

d5 = df_new[df_new.Time.dt.date > tday - pd.to_timedelta("90day")]
print("Filtering the data using the 90 day rule for calculating the bucket size");
print(d5);


d5['Amount'] = d5['Amount'].abs()
df_size = d5
# making a separate tabel for the categories
df_new_s = df_size[df_size['Category'].str.contains("Sho")];
df_new_s = df_new_s.append(pd.DataFrame(df_new_s.Amount.sum(), index = ["Total"], columns=["Amount"]))
df_new_s['Amount'] = df_new_s['Amount'].fillna(0)
print(df_new_s);

df_food_s = df_size[df_size['Category'].str.contains("Foo")];
df_food_s = df_food_s.append(pd.DataFrame(df_food_s.Amount.sum(), index = ["Total"], columns=["Amount"]))
df_food_s['Amount'] = df_food_s['Amount'].fillna(0)
print(df_food_s);

df_rent_s = df_size[df_size['Category'].str.contains("Ren")];
df_rent_s = df_rent_s.append(pd.DataFrame(df_rent_s.Amount.sum(), index = ["Total"], columns=["Amount"]))
df_rent_s['Amount'] = df_rent_s['Amount'].fillna(0)
print(df_rent_s);

df_travel_s = df_size[df_size['Category'].str.contains("Trav")];
df_travel_s = df_travel_s.append(pd.DataFrame(df_travel_s.Amount.sum(), index = ["Total"], columns=["Amount"]))
df_travel_s['Amount'] = df_travel_s['Amount'].fillna(0)
print(df_travel_s);

# Newly added????????????????????????
df_services_s = df_size[df_size['Category'].str.contains("Ser")];
df_services_s = df_services_s.append(pd.DataFrame(df_services_s.Amount.sum(), index = ["Total"], columns=["Amount"]))
df_services_s['Amount'] = df_services_s['Amount'].fillna(0)
print(df_services_s);

df_other_s = df_size[df_size['Category'].str.contains("Recr")];
df_other_s =df_other_s.append(pd.DataFrame(df_other_s.Amount.sum(), index = ["Total"], columns=["Amount"]))
df_other_s['Amount'] = df_other_s['Amount'].fillna(0)
print(df_other_s);

#making the total for each of the categories
df_ttl1_s = pd.DataFrame([df_food_s.loc['Total','Amount']],index=["Food"],columns=['Amount']);

df_ttl2_s = pd.DataFrame([df_new_s.loc['Total','Amount']],index=["Shopping"],columns=['Amount']);

df_ttl3_s = pd.DataFrame([df_travel_s.loc['Total','Amount']],index=["Travel"],columns=['Amount']);

df_ttl4_s = pd.DataFrame([df_rent_s.loc['Total','Amount']],index=["Rent"],columns=['Amount']);

df_ttl5_s = pd.DataFrame([df_services_s.loc['Total','Amount']],index=["Bills"],columns=['Amount']);

df_ttl6_s = pd.DataFrame([df_other_s.loc['Total','Amount']],index=["Other"],columns=['Amount']);


frames_s=[df_ttl1_s, df_ttl2_s, df_ttl3_s, df_ttl4_s,df_ttl5_s,df_ttl6_s]

result_s = pd.concat(frames_s);
print(result_s);

print("1: after the averages")

def times3(x):
    return x/3;
result_s = result_s['Amount'].apply(times3).reset_index(name='Amount');

print(result_s);









df = d4

# making a separate tabel for the categories
df_new = df[df['Category'].str.contains("Shop")];
df_new = df_new.append(pd.DataFrame(df_new.Amount.sum(), index = ["Total"], columns=["Amount"]))
df_new['Amount'] = df_new['Amount'].fillna(0)
print(df_new);

df_food = df[df['Category'].str.contains("Foo")];
df_food = df_food.append(pd.DataFrame(df_food.Amount.sum(), index = ["Total"], columns=["Amount"]))
df_food['Amount'] = df_food['Amount'].fillna(0);
print(df_food);

df_rent = df[df['Category'].str.contains("Ren")];
df_rent = df_rent.append(pd.DataFrame(df_rent.Amount.sum(), index = ["Total"], columns=["Amount"]))
df_rent['Amount'] = df_rent['Amount'].fillna(0);
print(df_rent);

df_travel = df[df['Category'].str.contains("Trav")];
df_travel = df_travel.append(pd.DataFrame(df_travel.Amount.sum(), index = ["Total"], columns=["Amount"]))
df_travel['Amount'] = df_travel['Amount'].fillna(0);
print(df_travel);

df_bills = df[df['Category'].str.contains("Ser")];
df_bills = df_bills.append(pd.DataFrame(df_bills.Amount.sum(), index = ["Total"], columns=["Amount"]))
df_bills['Amount'] = df_bills['Amount'].fillna(0);
print(df_bills);

df_other = df[df['Category'].str.contains("Rec")];
df_other = df_other.append(pd.DataFrame(df_other.Amount.sum(), index = ["Total"], columns=["Amount"]))
df_other['Amount'] = df_other['Amount'].fillna(0);
print(df_other);

# making the total for each of the categories
df_ttl1 = pd.DataFrame([df_food.loc['Total','Amount']],index=["Food"],columns=['Amount']);

df_ttl2 = pd.DataFrame([df_new.loc['Total','Amount']],index=["Shopping"],columns=['Amount']);

df_ttl3 = pd.DataFrame([df_travel.loc['Total','Amount']],index=["Travel"],columns=['Amount']);

df_ttl4 = pd.DataFrame([df_rent.loc['Total','Amount']],index=["Rent"],columns=['Amount']);

df_ttl5 = pd.DataFrame([df_bills.loc['Total','Amount']],index=["Bills"],columns=['Amount']);

df_ttl6 = pd.DataFrame([df_other.loc['Total','Amount']],index=["Other"],columns=['Amount']);

print("2: Calculating the total for each category")
frames=[df_ttl1, df_ttl2, df_ttl3, df_ttl4,df_ttl5,df_ttl6]

result = pd.concat(frames);
print(result);

















#================================================================================================================================
print("starting the bucket filling")
# df1 =df.copy();
# #df1 = pd.DataFrame(data,columns=['Category','Amount']);
# print(df1);
# df2 = df1.copy()
df2 = result.copy();

df = df2;
data=[[240,'Other']]
df_other = pd.DataFrame(data,columns=['Amount','Category']);

df['Category'] = df.index
result_s['Category']=result_s.index

print(df)
df = df.reset_index(drop=True)
result_s = result_s.reset_index(drop=True)
print(result_s)
# df = pd.concat([df,pd.DataFrame(data)],  axis=0,ignore_index=True)
# df.append(Series([None]*2, index=['col1','col2']), ignore_index=True)
# df = df.append(data, ignore_index=True)
# df = df.add(data, axis=0, level=None, fill_value=None)

# df.loc[4] = [240,'Other']
# print(df)

# Category for the Rent=====================================================
df_rent= df[df['Category'].str.contains("Ren")];
df_rent['Amount'] = df_rent['Amount'].fillna(0)

df_rent.loc[:,'bucket'] = result_s.loc[3, 'Amount'];
print(df_rent)
if float(df_rent['bucket']) <= float(income):
    print("your income is good");
    df_rent.loc[:,'bucket_fill'] = df_rent['bucket'];
    df_rent.loc[:,'Amount'] = income;
    df_rent.loc[:,'rem_income'] = income - df_rent['bucket_fill'];
    print(df_rent)
    line=0
else:
    print("Your income is insufficient")
    line = 1
goto(line)




# Category for the Bills=======================================
if line!=1:
    df_bills = df[df['Category'].str.contains("Bil")];
    # df_bills['Amount'] = df_bills['Amount'].fillna(0);
    df_bills.loc[:,'Amount'] = df_rent['rem_income'].iloc[0];
    df_bills.loc[:,'bucket'] = result_s.loc[4, 'Amount'];
    df_bills.loc[:,'bucket_fill'] = df_bills['bucket'];
    print(df_bills)
    if df_rent.get_value(3,'rem_income',takeable=False) >= float(df_bills.loc[:,'bucket_fill']):
        df_bills.loc[:,'Amount'] = df_rent.get_value(3,'rem_income',takeable=False);
        df_bills.loc[:,'rem_income'] = df_rent.get_value(3,'rem_income',takeable=False) - df_bills['bucket_fill'];
        print(df_bills)
        line = 0
    else:
        df_bills.loc[:,'bucket_fill'] = df_bills['Amount'];
        df_bills.loc[:,'rem_income'] = 0
        print("Your income is insufficient");
        print(df_bills)
        frames=[df_rent,df_bills]

        result = pd.concat(frames);
        result = result[['Category','Amount','bucket','bucket_fill','rem_income']]
        result.loc[:,'id'] = user_id
        print(result);
        line = 1
goto(line)
        
# x + y < rem income
# 
# 
# Category for the Shop=======================================================
if line!=1:
    df_shop = df[df['Category'].str.contains("Shop")];
    df_shop.loc[:,'bucket'] = result_s.loc[1, 'Amount'];
    df_food = df[df['Category'].str.contains("Foo")];
    df_food.loc[:,'bucket'] = result_s.loc[0, 'Amount'];
    df_travel = df[df['Category'].str.contains("Tra")];
    df_travel.loc[:,'bucket'] = result_s.loc[2, 'Amount'];
    df_math =  float(df_food.loc[:,'bucket']) + float(df_shop.loc[:,'bucket']) + float(df_travel.loc[:,'bucket'])
    if df_math < float( df_bills.loc[:,'rem_income']):
        print("df_math")
        print (df_math)
        df_shop.loc[:,'bucket_fill'] = df_shop['bucket'];
        # if df_bills.loc[2,'rem_income'] >= float(df_shop.loc[:,'bucket_fill']):
        print("Your income is good!")
        df_shop.loc[:,'Amount'] = df_bills['rem_income'].iloc[0];
        df_shop.loc[:,'rem_income'] = df_bills['rem_income'].iloc[0] - df_shop['bucket_fill'];
        print(df_shop)
        # else:
        #     print("your income is insufficient")
        #     line=1
        # goto(line)
        # Category for the Food
        if line!=1:
            df_food.loc[:,'bucket_fill'] = df_food['bucket'];
            # if df_food.loc[1,'rem_income'] >= float(df_food.loc[:,'bucket_fill']):
            print("Your income is good!")
            print(df_food)
            df_food.loc[:,'Amount'] = df_shop['rem_income'].iloc[0];
            df_food.loc[:,'rem_income'] = df_shop['rem_income'].iloc[0] - df_food['bucket_fill'];
            print(df_food)
            # else:
        #         print("your income is insufficient")
        #         line=1
        # goto(line)
        # Category for the travel
        if line!=1:
            df_travel.loc[:,'bucket_fill'] = df_travel['bucket'];
            # if df_food.loc[1,'rem_income'] >= float(df_food.loc[:,'bucket_fill']):
            print("Your income is good!")
            print(df_travel)
            df_travel.loc[:,'Amount'] = df_food['rem_income'].iloc[0];
            df_travel.loc[:,'rem_income'] = df_food['rem_income'].iloc[0] - df_travel['bucket_fill'];
            print(df_travel)
            # else:
        #         print("your income is insufficient")
        #         line=1
        # goto(line)


    else:
        div = float( df_bills.loc[:,'rem_income']) / df_math;
        print(div)
        print("df_math")
        print (df_math)
        df_shop.loc[:,'bucket_fill'] = df_shop['bucket']*div*0.98;
        # if df_bills.loc[2,'rem_income'] >= float(df_shop.loc[:,'bucket_fill']):
        print("Your income is good!")
        df_shop.loc[:,'Amount'] = df_bills['rem_income'].iloc[0];
        df_shop.loc[:,'rem_income'] = df_bills['rem_income'].iloc[0] - df_shop['bucket_fill'];
        print(df_shop)
        # else:
        #     print("your income is insufficient")
        #     line=1
        # goto(line)
        # Category for the Food
        if line!=1:
            df_food.loc[:,'bucket_fill'] = df_food['bucket']*div*0.98;
            # if df_food.loc[1,'rem_income'] >= float(df_food.loc[:,'bucket_fill']):
            print("Your income is good!")
            print(df_food)
            df_food.loc[:,'Amount'] = df_shop['rem_income'].iloc[0];
            df_food.loc[:,'rem_income'] = df_shop['rem_income'].iloc[0] - df_food['bucket_fill'];
            print(df_food)
            line=2
            # else:
        #         print("your income is insufficient")
        #         line=1
        # goto(line)
        if line!=1:
            df_travel.loc[:,'bucket_fill'] = df_travel['bucket']*div;
            # if df_food.loc[1,'rem_income'] >= float(df_food.loc[:,'bucket_fill']):
            print("Filling the travel bucket case 2")
            print(df_travel)
            df_travel.loc[:,'Amount'] = df_food['rem_income'].iloc[0];
            df_travel.loc[:,'rem_income'] = df_food['rem_income'].iloc[0] - df_travel['bucket_fill'];
            print(df_travel)
            line=2

# Category for the Others
if line!=1:
    df_other = df[df['Category'].str.contains("Oth")];
    df_other['Amount'] = df_other['Amount'].fillna(0)
    df_other.loc[:,'bucket'] = result_s.loc[3, 'Amount'];

    df_other.loc[:,'bucket_fill'] = float(df_other['bucket']);
    x = df_other.loc[:,'bucket_fill']
    if df_travel['rem_income'].iloc[0] >= float(x):
        print("Your income is good!")
        df_other.loc[:,'Amount'] = df_travel['rem_income'].iloc[0];
        df_other.loc[:,'rem_income'] = float(df_travel['rem_income'].iloc[0]) - float(df_other['bucket_fill']);
        print(df_other)
        line = 0
    else:
        df_other.loc[:,'Amount'] = df_travel['rem_income'].iloc[0];
        df_other.loc[:,'rem_income'] = float(df_travel['rem_income'].iloc[0]) - float(df_other['bucket_fill']);
        df_other.loc[:,'bucket_fill'] = df_other.loc[:,'Amount']
        print(df_other)
        line = 0
        print("your income is insufficient")
goto(line)
print(line)
if line!=2:
    if line!=1:
        # Category for the Making all the dataframes into one
        frames=[ df_rent,df_bills,df_shop,df_food,df_travel,df_other]
        result = pd.concat(frames);
        result.loc[:,'id'] = user_id
        print(result);

if line==2:
    # Category for the Making all the dataframes into one
    frames=[df_rent,df_bills,df_shop,df_food,df_travel]

    result = pd.concat(frames);
    
    result.loc[:,'id'] = user_id
    print(result);



# Catching the result if the income is less 
if line ==1:
    print("User has insufficient income")
    print(result);

# result.to_csv('bucket1.csv', sep=',')


# df1_db = pd.DataFrame(data,columns=['Category','Amount','bucket','bucket_fill','rem_income','id']);
print("Im here")
# # print all the first cell of all the rows
# for row in cur.fetchall():
#     print("the data - ",row[3] ,"-" , row[1],"-", row[2]," ", row[4]," ", row[0])

# df = pd.read_sql("SELECT * FROM transactionTable", con=db)
result = result.round(2);
print(result)
result.to_sql(con=engine, name='bucketFillTest', if_exists='append',flavor=None, index=False, chunksize=10000)
# df1_db.to_sql(con=conn, name='bucketFillTest', if_exists='replace', flavor='mysql', index=False, chunksize=10000)
conn.close()
db.close()