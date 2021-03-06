import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, FormControl, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom'
import api from '../../services/api'

import moment from 'moment'

import './index.css'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Search from '../../components/Search';

interface ITask {
    id: number;
    title: string;
    qtd: number;
    unid_medida: string;
    provider: string;
    user_creation: string;
    created_at: Date;
}

const Tasks: React.FC = () => {

    const [tasks, setTasks] = useState<ITask[]>([])
    const history = useHistory()

    useEffect(() => {
        loadTasks()
    }, [])

    async function loadTasks() {

        const response = await api.get('/bidding')
        console.log(response)
        setTasks(response.data)
    }

    async function finishedTask(id: number) {
        await api.patch(`/tasks/${id}`)
        loadTasks()
    }

    async function deleteTask(id: number) {
        await api.delete(`/tasks/${id}`)
        loadTasks()
    }

    function formateDate(date: Date) {
        return moment(date).format("DD/MM/YYYY")
    }

    function newTask() {
        history.push('/snackcontrol/bidding-create')
    }

    function editTask(id: number) {
        history.push(`/snackcontrol/order-edit/${id}`)
    }

    function viewTask(id: number) {
        history.push(`/tarefas/${id}`)
    }

    async function search() {
        const element = (document.getElementById("search") as unknown as HTMLInputElement).value;

        const response = await api.get(`/bidding/search?title=${element}`)
        console.log(response)
        setTasks(response.data)
    }

    return (
        <>
            <Header />
            <div className="container">
                <br />
                <div className="order-header">
                    <h3 className="mr-auto navbar-nav">Licitação</h3>
                    <div className="form-inline">
                        <input id="search" placeholder="Pesquisa" type="text" className="mr-sm-2 form-control" />
                        <button type="button" className="btn btn-outline-primary" onClick={() => search()}>Buscar</button>
                        <Button variant="outline-primary" className="btn btn-outline-primary button-bidding" onClick={newTask}>Inserir Licitação</Button>
                    </div>
                </div>
                <Table striped bordered hover className="text-center">
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Qtd</th>
                            <th>Un. Medida</th>
                            <th>Fornecedor</th>
                            <th>Usuário Criação</th>
                            <th>Data Criação</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            tasks.map(task => (
                                <tr key={task.id}>
                                    <td>{task.title}</td>
                                    <td>{task.qtd}</td>
                                    <td>{task.unid_medida}</td>
                                    <td>{task.provider}</td>
                                    <td>{task.user_creation}</td>
                                    <td>{formateDate(task.created_at)}</td>
                                </tr>
                            ))
                        }


                    </tbody>
                </Table>
            </div>
            <Footer />
        </>
    );
}

export default Tasks;