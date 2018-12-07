import pandas as pd

categories = ['game', 'productivity', 'social', 'wallpaper', 'weather']
companies = dict()
def _format(companyname, cate, row):
	return 'set("' + companyname + '", "' + row['AppName'] + '", "' + cate + '", "' + row['Developer ID'] + '", "' + row['Source'] + '", "' + row['Sink'] + '");\n'

def write_file(companies, cate):
	df = pd.read_csv(cate+'.csv')
	f = open('../gethscript/set_' + cate + '.js', 'w')
	for index, row in df.iterrows():
		if (companies.get(row['AppName']) == None):
			companyname = companies[row['AppName']] = 'secu_com_' + str(len(companies) % 3)
		else:
			companyname = companies[row['AppName']]
		f.write(_format(companyname, cate, row))
	f.close()

for cate in categories:
	write_file(companies, cate)
