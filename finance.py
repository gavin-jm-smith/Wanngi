import pandas as pd
from alpha_vantage.timeseries import TimeSeries
from alpha_vantage.techindicators import TechIndicators
import time
import matplotlib.pyplot as plt
from matplotlib import style
import sys
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from matplotlib.widgets import Button


api_key = 'DXUCBBRA5HQINDEV'

ts = TimeSeries(key=api_key, output_format='pandas')
#Pulling all the data, for every minute for a stock. TODO: do the same for overall market.  
company_ticker = 'GMS' #'AAPL'


interval_time = '1min'
data_ts, meta_data_ts = ts.get_intraday(symbol=company_ticker, interval = interval_time, outputsize = 'full') 


period = 60 #Small Moving Average over 60 minutes. 
ti = TechIndicators(key=api_key, output_format='pandas')
data_ti, meta_data_ti = ti.get_sma(symbol=company_ticker, interval = interval_time, time_period=period, series_type='close')

#select information we want specifically
df1 = data_ti #SMA
df2 = data_ts['4. close'].iloc[period-1::] #only pulling the closing information, because df2 has more data entries than df1 (calculating 60 periods) we need to adjust it by calling 'iloc' to remove the first 60 entries in this dataframe. Share Prices. 
df2.index = df1.index #theyre the same. 
total_df = pd.concat([df1, df2], axis=1) #Joining the two DF's

#Creating a new DF, including differences and movement %
difference_df = total_df[:] #copys DF into new variable. 
difference_df['Difference'] = total_df['SMA'].sub(total_df['4. close'], axis = 0)
difference_df['Diff %'] = total_df['4. close']/total_df['SMA']
markup = difference_df[:]
markup['Markup T/F'] = (difference_df['Diff %'] >=1.015) | (difference_df['Diff %']<=0.985)

#Configure the buttons

#Workings


#Plotting
plt.plot(total_df)
plt.title("Company Ticker: '" + company_ticker + "'")
plt.xlabel('Date')
plt.ylabel('Share Price ($)')  
plt.show()

