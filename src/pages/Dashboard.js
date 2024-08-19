import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import Cards from '../components/Cards';
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import TransactionsTable from '../components/TransactionsTable';
import ChartComponent from '../components/Charts';
import NoTransactions from '../components/NoTransactions';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [currentBalance, setCurrentBalance] = useState(0)

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  }
  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  }
  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  }
  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  }

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  const addTransaction = async(transaction, many) => {
    try{
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if(!many) toast.success("Transaction Added!");
      //we need to add every new transaction that is added to the existing the previous ones
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    }
    catch(e){
      console.error("Error adding document: ", e);
      if(!many) toast.error("Couldn't add transaction");
    }
  }

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expenseTotal = 0;
    transactions.forEach((transaction) => {
      if(transaction.type === "Income"){
        incomeTotal += transaction.amount;
      }
      else{
        expenseTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setCurrentBalance(incomeTotal-expenseTotal);
  };

  useEffect(() => {
    //get all docs grom firebase
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async() => {
    setLoading(true);
    if(user){
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        //doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      })
      setTransactions(transactionsArray);
      console.log("Transactions Array", transactionsArray);
      //toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div>
      <Header/>
      {loading ? <p>Loading...</p> :
        <>
        <Cards
          income={income}
          expense={expense}
          currentBalance={currentBalance}
          showIncomeModal={showIncomeModal}
          showExpenseModal={showExpenseModal}
        />
        {transactions && transactions.length!=0 ? (
          <ChartComponent sortedTransactions={sortedTransactions}/>
        ) : (
          <NoTransactions/>
        )}
        <AddExpenseModal 
          isExpenseModalVisible={isExpenseModalVisible}
          handleExpenseCancel={handleExpenseCancel}
          onFinish={onFinish}
        />
        <AddIncomeModal 
          isIncomeModalVisible={isIncomeModalVisible}
          handleIncomeCancel={handleIncomeCancel}
          onFinish={onFinish}
        />
        <TransactionsTable 
          transactions={transactions} 
          addTransaction={addTransaction}
          fetchTransactions={fetchTransactions}
        />
        </>
      }
    </div>
  )
}

export default Dashboard;