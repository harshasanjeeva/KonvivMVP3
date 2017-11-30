import sys

startingFunds = sys.argv[1]
startingFunds1 = float(sys.argv[2])

# file = open("testfile.txt","w");
 
# file.write(startingFunds);
# file.write(startingFunds1);
# print("hi");
 
# file.close(); 

f = open("test6.txt","r+");
f.write(startingFunds);
# f.write(startingFunds1);
f.close();