---
title: NSE Insider Trades
permalink: /nse-insider-trades
---

I saw [this post](https://www.reddit.com/r/stocks/comments/puhzzv/should_you_follow_insider_transactions_i_analyzed/) on Reddit which analyses insider trades filed with the SEC for investment ideas and tried to replicate this for insider trades files with the NSE. [Here are the results](https://docs.google.com/spreadsheets/d/1AEs4K4PZOg1vfK42M2StGNqC6dI0Dyux/edit#gid=2111613884) if you want to jump right in. The code and data are available [here](https://github.com/parakalan/nse-insider-trades)

We filter companies with market cap greater than INR 5000 cr (to weed out risky small caps) and consider buying only by the following people. -
* Employees/Designated Employees
* Immediate relative
* Director
* Key Managerial Personnel

Here are the top 10 companies, sorted by their average 12 month return.

|	Company 	| 	Avg 1 Month Return (%)	|	Avg 3 Month Return (%)	|	Avg 6 Month Return (%) |	Avg 12 Month Return (%)	|
|:-------------:|:-------------------------:|:-------------------------:|:------------------------:|:--------------------------:|
|	TANLA 		| 		23.03				|		95.72				|		412.17		   	   |		1,084.34			|
|	AARTIDRUGS 	| 		7.08				|		-12.38				|		121.93		   	   |		386.36				|
|	TATAMOTORS 	| 		9.79				|		37.86				|		111.07		   	   |		333.57				|
|	JSWSTEEL 	| 		22.74				|		49.30				|		105.17		   	   |		241.74				|
|	DALBHARAT 	| 		-0.56				|		33.63				|		50.97		   	   |		208.60				|
|	CYIENT 		| 		10.59				|		49.20				|		72.44		   	   |		201.09				|
|	LAURUSLABS 	| 		19.53				|		31.13				|		82.34		   	   |		186.80				|
|	DIXON 		| 		5.45				|		17.60				|		27.80		   	   |		175.51				|
|	TATASTEEL 	| 		9.61				|		19.35				|		47.24		   	   |		161.29				|
|	CHOLAFIN 	| 		14.67				|		30.87				|		84.14		   	   |		159.62				|
|	FSL 		| 		-22.63				|		-21.74				|		35.94		   	   |		146.27				|




### How do I use this ?

There are a few ways in which this data can be used.
*  If you are looking to buy a company for long term but waiting for right time, insider buying can indicate a strong positive sentiment. We see that insiders enter during stock downturn, which implies they are bullish on the company over long term.
*  This can also help with short term positions. In some companies, insider buying can reflect in the share price within a month. If you sort returns by average 1 month return, you can see these companies. Few examples - SRF, JUBLPHARMA, TATACONSUM, AJANTPHARM, TANLA, JSWSTEEL, BRIGADE, JUBLFOOD, LAURUSLABS, BRITANNIA. Depending on your horizon, you can invest on companies which have a turnaround within that time horizon. Be advised that this will be a short term position only. Over the long term, you might want to look into company financials and its history.
