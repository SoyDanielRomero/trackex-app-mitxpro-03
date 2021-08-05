import React, { useState } from "react";
import styled from "styled-components";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import { v4 as uuidv4 } from "uuid";

import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

import data from "./data";
import { Debug } from "../../aux/Debug";

const Table = styled.table`
  width: 100%;
  padding: 16px 0;
  text-align: left;
`;

const HeadCell = styled.th`
  padding: 16px 0;
  width: 20%;
`;

const TableCell = styled.td`
  padding: 8px 0;
  width: 23%;
  &(:last-of-type) {
    display: flex;
    justify-content: flex-end;
    width: 8%;
  }
`;

const Amount = styled.p`
  color: ${(props) => (props.type === "expense" ? "#FF7661" : "#00E4C6")};
`;

const Grid = styled.div`
  width: 100%;
  padding: 64px;
`;
const AddButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Container = styled.div`
  padding: 16px;
  width: 380px;
  height: 100vh;
  background-color: #252f3d;
  overflow: scroll;
  color: white;
`;

const FieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const RadioOptionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TransactionList = () => {
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState(data);

  const transactionSchema = Yup.object().shape({
    name: Yup.string().min(3).required("Required"),
    date: Yup.string().min(10).required("Fecha Required"),
    amount: Yup.number().required("Required"),
  });

  const categories = [
    { value: "eating_out", label: "Eating out" },
    { value: "clothes", label: "Clothes" },
    { value: "electronics", label: "Electronics" },
    { value: "groceries", label: "Groceries" },
    { value: "other", label: "Other" },
  ];

  const types = [
    { value: "expense", label: "Expense" },
    { value: "income", label: "Income" },
  ];

  const addTransaction = (transaction) => {
    //add new transaction to state
    console.log("addTransaction values", transaction);
    // const _transactions = [...transactions];
    // _transactions.push(transaction);
    // setTransactions(_transactions);

    setTransactions([...transactions, { ...transaction }]);
  };

  const deleteTransaction = (id) => {
    console.log("deleteTransaction id", id);
    const _transactions = transactions.filter(
      (transaction) => transaction.id !== id
    );

    // console.log("_transactions", _transactions);
    setTransactions(_transactions);
  };

  return (
    <Grid>
      <AddButtonWrapper>
        <Button
          onClick={() => {
            console.log("Abrir formulario");
            setOpen(true);
          }}
          color='primary'
          variant='contained'
        >
          + Add Transaction
        </Button>
      </AddButtonWrapper>
      <Table>
        <thead>
          <tr>
            <HeadCell>Date</HeadCell>
            <HeadCell>Name</HeadCell>
            <HeadCell>Category</HeadCell>
            <HeadCell>Amount</HeadCell>
            <HeadCell></HeadCell>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            /* console.log("transaction", transaction); */
            return (
              <tr key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.name}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  <Amount type={transaction.type}>{transaction.amount}</Amount>
                </TableCell>

                <TableCell>
                  <EditIcon
                    style={{ marginRight: "16px" }}
                    onClick={() => {
                      console.log("editar transacción");
                    }}
                  />

                  <DeleteForeverIcon
                    style={{ color: "#F94144" }}
                    onClick={() => {
                      console.log("borrar transacción");
                      deleteTransaction(transaction.id);
                    }}
                  />
                </TableCell>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Drawer
        elevation={2}
        anchor='right'
        open={open}
        onClose={() => {
          console.log("close");
          setOpen(false);
        }}
      >
        <Container>
          <h2>New transaction</h2>
          <Formik
            initialValues={{
              name: "macbook pro",
              amount: 3330,
              date: "22/04/2021",
              category: "electronics",
              type: "expense",
            }}
            validationSchema={transactionSchema}
            onSubmit={(values, { setSubmitting }) => {
              addTransaction({
                id: uuidv4(),
                ...values,
              });
              setOpen(false);
            }}
          >
            {({ isSubmitting, values, handleChange, errors, touched }) => (
              <>
                <Form>
                  <FieldsWrapper>
                    <TextField
                      fullWidth
                      id='name'
                      name='name'
                      label='Name'
                      value={values.name}
                      onChange={handleChange}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                    />
                    <TextField
                      fullWidth
                      id='amount'
                      name='amount'
                      label='Amount'
                      type='number'
                      value={values.amount}
                      onChange={handleChange}
                      error={touched.amount && Boolean(errors.amount)}
                      helperText={touched.amount && errors.amount}
                    />
                    <TextField
                      fullWidth
                      id='date'
                      name='date'
                      label='Date'
                      value={values.date}
                      onChange={handleChange}
                      error={touched.date && Boolean(errors.date)}
                      helperText={touched.date && errors.date}
                    />
                    <RadioOptionsWrapper>
                      <FormControl component='fieldset'>
                        <FormLabel component='legend'>Category</FormLabel>
                        <RadioGroup
                          aria-label='category'
                          name='category'
                          value={values.category}
                          onChange={handleChange}
                        >
                          {categories.map((category) => {
                            return (
                              <FormControlLabel
                                control={<Radio color='primary' />}
                                value={category.value}
                                label={category.label}
                              />
                            );
                          })}
                        </RadioGroup>
                      </FormControl>
                      <FormControl component='fieldset'>
                        <FormLabel component='legend'>Type</FormLabel>
                        <RadioGroup
                          aria-label='type'
                          name='type'
                          value={values.type}
                          onChange={handleChange}
                        >
                          {types.map((type) => {
                            return (
                              <FormControlLabel
                                control={<Radio color='primary' />}
                                value={type.value}
                                label={type.label}
                              />
                            );
                          })}
                        </RadioGroup>
                      </FormControl>
                    </RadioOptionsWrapper>
                    <ActionsWrapper>
                      <Button
                        onClick={() => setOpen(false)}
                        variant='outlined'
                        color='primary'
                      >
                        Cancel
                      </Button>
                      <Button
                        variant='contained'
                        color='primary'
                        type='submit'
                        disabled={isSubmitting}
                      >
                        Save
                      </Button>
                    </ActionsWrapper>
                  </FieldsWrapper>
                </Form>
                <Debug />
              </>
            )}
          </Formik>
        </Container>
      </Drawer>
    </Grid>
  );
};

export { TransactionList };
