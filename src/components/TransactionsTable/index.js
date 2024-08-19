import { Radio, Select, Table } from 'antd';
import React, { useState } from 'react';
import searchImg from '../../assets/search.svg'
import { parse, unparse } from 'papaparse';
import { toast } from 'react-toastify';

const TransactionsTable = ({transactions, addTransaction, fetchTransactions}) => {
    const {Option} = Select;
    const [search, setSearch] = useState(""); 
    const [typeFilter, setTypeFilter] = useState("");
    const [sortKey, setSortKey] = useState(""); 

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount"
        },
        {
            title: "Tag",
            dataIndex: "tag",
            key: "tag"
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date"
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type"
        },
    ];

    let filteredTransactions = transactions.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) && 
        item.type.includes(typeFilter)
    );

    let sortedTransactions = filteredTransactions.sort((a, b) => {
        if(sortKey === 'date'){
            return new Date(a.date) - new Date(b.date);
        }
        else if(sortKey === 'amount'){
            return a.amount - b.amount;
        }
        else{
            return 0;
        }
    });

    const exportCSV = () => {
        var csv = unparse({
            fields: ["name", "type", "date", "amount", "tag"],
            data: transactions,
        });
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Transactions.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const importFromCsv = (event) => {
        event.preventDefault();
        try{
            parse(event.target.files[0], {
                header: true,
                complete: async(results) => {
                    //console.log("Results: ", results);
                    //now results.data is an array of objects representing our csv rows
                    for(const transaction of results.data){
                        console.log("Transactions", transaction);
                        const newTransaction = {
                            ...transaction, 
                            amount: parseFloat(transaction.amount),
                        };
                        await addTransaction(newTransaction, true);
                    }
                },
            });
            toast.success("All transactions added!");
            fetchTransactions();
            event.target.files = null;
        }
        catch(e){
            toast.error(e.message);
        }
    }

  return (
    <div
        style={{
            width: "97%",
            paddingLeft: '1.5rem',
            justifyContent: 'center',
        }}
    >
        <div
            style={{
                display: "flex",
                justifyContent: 'space-between',
                gap: "1rem",
                alignItems: "center",
                marginBottom: '1rem',
            }}
        >
            <div className='input-flex'>
                <img src={searchImg} width='16'/>
                <input 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    placeholder="Search by Name"
                />
            </div>
            <Select
                className='select-input'
                onChange={(value) => setTypeFilter(value)}
                value={typeFilter}
                placeholder="Filter"
                allowClear
            >
                <Option value="">All</Option>
                <Option value='Income'>Income</Option>
                <Option value='Expense'>Expense</Option>
            </Select>
        </div>
        <div className='my-table'>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: '1rem'
                }}
            >
                <h2>My Transactions</h2>

                <Radio.Group
                    className='input-radio'
                    onChange={(e) => setSortKey(e.target.value)}
                    value={sortKey}
                >
                    <Radio.Button value="">No Sort</Radio.Button>
                    <Radio.Button value="date">Sort by Date</Radio.Button>
                    <Radio.Button value="amount">Sort by Amount</Radio.Button>
                </Radio.Group>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1rem',
                        width: '400px'
                    }}
                >
                    <button className='btn' onClick={exportCSV}>
                        Export to CSV
                    </button>
                    <label for='file-csv' className='btn btn-blue'>
                        Import from CSV
                    </label>
                    <input
                        id='file-csv'
                        type='file'
                        accept='.csv'
                        required
                        onChange={importFromCsv}
                        style={{display: 'none'}}
                    />
                </div>
            </div>
            <Table dataSource={sortedTransactions} columns={columns} style={{width: '99%'}}/>
        </div>
    </div>
  );
}

export default TransactionsTable