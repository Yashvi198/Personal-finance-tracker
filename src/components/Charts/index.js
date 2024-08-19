import { Line, Pie } from '@ant-design/charts';
import { Card, Row } from 'antd';
import React from 'react'

const ChartComponent = ({sortedTransactions}) => {
    const data = sortedTransactions.map((item) => {
        return {date: item.date, amount: item.amount};
    });
    
    let spendingData = sortedTransactions.filter((transaction) => {
        if(transaction.type == "Expense"){
            return {tag: transaction.tag, amount: transaction.amount};
        }
    });

    let newSpendings = [
        {tag: "Food", amount: 0},
        {tag: "Stationery", amount: 0},
        {tag: "Office", amount: 0},
        {tag: "Grocery", amount: 0},
        {tag: "Others", amount: 0},
    ];
    spendingData.forEach((item) => {
        if (item.tag == "Food"){
            newSpendings[0].amount += item.amount;
        }
        else if (item.tag == "Stationery"){
            newSpendings[1].amount += item.amount;
        }
        else if (item.tag == "Office"){
            newSpendings[2].amount += item.amount;
        }
        else if (item.tag == "Grocery"){
            newSpendings[3].amount += item.amount;
        }
        else{
            newSpendings[4].amount += item.amount;
        }
    });

    const config = {
        data: data,
        autoFit: true,
        xField: 'date',
        yField: 'amount',
    };
    const spendingConfig = {
        data: newSpendings,
        angleField: "amount",
        colorField: "tag",
    };
    let chart;
    let pieChart;

    const cardStyle = {
        boxShadow: "0px 0px 30px 8px rgba(227, 227, 227, 0.75)",
        margin: "2rem",
        borderRadius: "0.5rem",
        minWidth: "400px",
        flex: 1,
      };

    return (
        <Row gutter={16}>
            <Card bordered={true} style={cardStyle}>
                <h2>Financial Statistics</h2>
                <Line 
                    {...config} 
                    onReady={(chartInstance) => (chart = chartInstance)}
                />
            </Card>
            <Card bordered={true} style={{ ...cardStyle, flex: 0.45 }}>
                <h2>Total Spending</h2>
                {spendingData.length == 0 ? (
                <p>Seems like you haven't spent anything till now...</p>
                ) : (
                <Pie 
                    {...spendingConfig}
                    onReady={(chartInstance) => (pieChart = chartInstance)}
                />
                )}
            </Card>
        </Row>
    )
}

export default ChartComponent
