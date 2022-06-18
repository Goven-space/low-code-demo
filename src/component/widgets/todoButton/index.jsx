import React, { useState, useEffect } from 'react';
import { getMyTodo } from '../../../api/workbench';
import './index.less';

const baseURL = window.location.origin + '/home.html?rc_appId=bpm_todo'

const TodoButton = (props) => {
    const [todoCount, setTodoCount] = useState(0);

    useEffect(() => {
        getMyTodo().then(res => {
            const { data } = res
            if (data.meta.statusCode === 200) {
                setTodoCount(data.data.todoCount)
            }
        })
    }, [])

    const flag = props.addons ? false : true;

    const handleClick = (menuKey) => {
        !flag && (window.location.href = `${baseURL}&menuKey=${menuKey}`)
    }

    return (
        <div className='flow-todoBtn-wrapper'>
            <div className="todoBtn-myTodo">
                <button className='myTodo-content' onClick={() => { handleClick("my_todo") }}>
                    <div class="myTodo-title">
                        <span className='myTodo-icon'><img src="/assets/workbench/flow_todo.png" alt="我的代办" /></span>
                        <h3>我的待办</h3>
                    </div>
                    <div className='myTodo-text'>
                        <h2>{todoCount}</h2>
                    </div>
                </button>
            </div>
            <div className='todoBtn-btnList'>
                <ul className='btnList-container'>
                    <li className='btnList-item'>
                        <button onClick={() => { handleClick("my_application") }} >
                            <span className="btnList-icon"><img src="/assets/workbench/flow_create.png" alt="我发起的" /></span>
                            <p>我发起的</p>
                        </button>
                    </li>
                    <li className='btnList-item'>
                        <button onClick={() => { handleClick("my_finished") }} >
                            <span className="btnList-icon"><img src="/assets/workbench/flow_transactor.png" alt="我处理的" /></span>
                            <p>我处理的</p>
                        </button>
                    </li>
                    <li className='btnList-item'>
                        <button onClick={() => { handleClick("my_copy") }} >
                            <span className="btnList-icon"><img src="/assets/workbench/flow_ccuser.png" alt="抄送我的" /></span>
                            <p>抄送我的</p>
                        </button>
                    </li>
                    <li className='btnList-item'>
                        <button onClick={() => { handleClick("my_commission") }} >
                            <span className="btnList-icon"><img src="/assets/workbench/entrust.png" alt="我委托的" /></span>
                            <p>我委托的</p>
                        </button>
                    </li>
                    <li className='btnList-item'>
                        <button onClick={() => { handleClick("Initiate_new_process") }} >
                            <span className="btnList-icon"><img src="/assets/workbench/flow_launch.png" alt="发起新流程" /></span>
                            <p>发起新流程</p>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default TodoButton;