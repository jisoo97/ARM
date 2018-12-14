import pandas as pd
import sys

categories = ['game', 'productivity', 'social', 'wallpaper', 'weather']
companies = dict()
def _format(cname, cate, row):
	getdatastr = 'var getdata = contract.set.getData("' + cname + '", "' + row['AppName'] + '", "' + cate + '", "' + row['Developer ID'] + '", "' + row['Source'] + '", "' + row['Sink'] + '");\n'
	transactionstr = "var reciept = web3.eth.sendTransaction({ from: defaultAddr, to: contractAddr, data: getdata, gas: 7000000 });\n"
	consolestr = "console.log(reciept);\n"
	return getdatastr + transactionstr + consolestr

def write_file(fname, cname, cate):
	df = pd.read_csv(fname)
	outfile = '../gethscript/set_' + cname + '_' + cate + '.js'
	f = open(outfile, 'w')
	for index, row in df.iterrows():
		f.write(_format(cname, cate, row))
	print(outfile + " has created")
	f.close()

print("file name :")
fname = raw_input()
print("company name :")
cname = raw_input()
print("category :")
cate = raw_input()
write_file(fname, cname, cate)
