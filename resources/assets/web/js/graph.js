const bsGraph = {
    square: (id, { q1, q2, q3 }) => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = ``;
            let height = container.style.height;
            height = height.replace('px', '');
            let q2h = Number(q2.value) > Number(q3.value) ? 70 : 30;
            let q3h = Number(q3.value) > Number(q2.value) ? 70 : 30;

            if (Number(q2.value) == Number(q3.value)) {
                q2h = 50;
                q3h = 50;
            }

            container.innerHTML = ` <div>
                                        <div style="width:100%; display:flex; scroll">
                                            <div style="width:50%">
                                                <div style="height:${ (height - 20) }px; border: 3px solid #7B1FA2; margin: 2px 1px; border-radius: 10px 0px 0px 10px; position: relative; padding: 2px;">
                                                    <div style="text-align: center; color: darkgray;">${ q1.title }</div>
                                                    <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; font-size: 1rem;font-weight: 500;">${ q1.text }</div>
                                                </div>
                                            </div>
                                            <div style="width:50%">
                                                <div style="height:${ q2h }%; border: 3px solid #4CAF50; margin: 2px 1px; border-radius: 0px 10px 0px 0px; position: relative; padding: 2px;">
                                                    <div style="text-align: center; color: darkgray;">${ q2.title }</div>
                                                    <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; font-size: 1rem;font-weight: 500;">${ q2.text }</div>
                                                </div>
                                                <div style="height:calc(${ q3h }% - 6px); border: 3px solid #03A9F4; margin: 2px 1px; border-radius: 0px 0px 10px 0px; position: relative; padding: 2px;">
                                                    <div style="text-align: center; color: darkgray;">${ q3.title }</div>
                                                    <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; font-size: 1rem;font-weight: 500;">${ q3.text }</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="display:flex; width: 100%; height: 20px;padding-top:8px;">
                                            <div style="width: 33%;"><div style="height: 7px; width: 25px;background-color: #03A9F4;float: left;margin-top: 5px;margin-right: 5px;"></div><div style="float:left;font-size: 12px;">Ke</div></div>
                                            <div style="width: 33%;"><div style="height: 7px; width: 25px;background-color: #7B1FA2;float: left;margin-top: 5px;margin-right: 5px;"></div><div style="float:left;font-size: 12px;">Koa</div></div>
                                            <div style="width: 33%;"><div style="height: 7px; width: 25px;background-color: #4CAF50;float: left;margin-top: 5px;margin-right: 5px;"></div><div style="float:left;font-size: 12px;">Kd*(1-T)</div></div>
                                        </div>
                                    </div>`;
        }
    },
    square2: (id, { q1, q2, q3, q4 }) => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = ``;
            let height = container.style.height;

            let q2h = Number(q2.value) > Number(q3.value) ? 65 : 35;
            let q3h = Number(q3.value) > Number(q2.value) ? 65 : 35;
            if (Number(q2.value) == Number(q3.value)) {
                q2h = 50;
                q3h = 50;
            }

            let q4h = q3h;
            let transform = ``;
            let l2h = q3h;

            if (Number(q4.value) > Number(q3.value)) {
                q4h = (q3h + 15);
                transform = `rotate(-17deg) skew(-17deg)`;
                l2h = l2h + 5;

            } else if (Number(q4.value) < Number(q3.value)) {
                q4h = (q3h - 15);
                l2h = l2h - 10;
                transform = `rotate(15deg) skew(15deg)`;
            } else {
                l2h = l2h - 2;   
            }

            container.innerHTML = `<ul style="
                                            display: table;
                                            table-layout: fixed;
                                            width: 100%;
                                            margin: 0 auto;
                                            padding: 0px;"
                                        >
                                        <li style="
                                            position: relative;
                                            display: table-cell;
                                            vertical-align: bottom;
                                            height: ${ height };"
                                        >
                                            <div style="height:${ height }; border: 3px solid #7B1FA2; margin: 2px 1px; border-radius: 10px 0px 0px 10px; position: relative; padding: 2px;">
                                                <div style="text-align: center; color: darkgray;">${ q1.title }</div>
                                                <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; font-size: 1rem;">${ q1.text }</div>
                                            </div>
                                        </li>
                                        <li style="
                                            position: relative;
                                            display: table-cell;
                                            vertical-align: bottom;
                                            height: ${ height };"
                                        >
                                            <div style="height:${ q2h }%; border: 3px solid #4CAF50; margin: 2px 1px; border-radius: 0px 10px 0px 0px; position: relative; padding: 2px;">
                                                <div style="text-align: center; color: darkgray;">${ q2.title }</div>
                                                <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; font-size: 1rem;">${ q2.text }</div>
                                            </div>
                                            <div style="height:calc(${ q3h }% - 6px); border: 3px solid #03A9F4; margin: 2px 1px; border-radius: 0px 0px 10px 0px; position: relative; padding: 2px;">
                                                <div style="text-align: center; color: darkgray;">${ q3.title }</div>
                                                <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; font-size: 1rem;">${ q3.text }</div>
                                            </div>
                                        </li>
                                        <li style="
                                            position: relative;
                                            display: table-cell;
                                            vertical-align: bottom;
                                            height: ${ height };"
                                        >
                                        <div style="
                                            width: 100%;
                                            border-style: dotted;
                                            border-color: gray;
                                            border-bottom: 0;
                                            border-left: 0;
                                            border-right: 0;
                                            height: ${l2h}%;
                                            opacity: 0.7;
                                            transform: ${transform};"
                                        ></div>
                                        <div style="
                                            width: 100%;
                                            border-style: dotted;
                                            border-color: gray;
                                            border-bottom: 0;
                                            opacity: 0.7;"
                                        ></div>
                                        </li>
                                        <li style="
                                            position: relative;
                                            display: table-cell;
                                            vertical-align: bottom;
                                            height: ${ height };"
                                        >

                                            <div>
                                                <p style="font-weight: 500;text-align:center;line-height: 15px;margin-bottom: 5px;">
                                                    ${q4.title}
                                                </p>
                                            </div>
                                            <div style="
                                                height: ${q4h}%;
                                                border: 3px solid #90caf9;
                                                border-radius: 0px 0px 10px 0px;
                                                -webkit-animation: draw 1s ease-in-out;
                                                animation: draw 1s ease-in-out;
                                                text-align: center;
                                                padding: 2px;
                                                position: relative; ">
                                                <div style="margin: 0; position: absolute; top: 45%; text-align: center; width: 100%; font-size: 1rem;">${ q4.text }</div>
                                            </div>
                                        </li>
                                    </ul>`;
        }
    },
    square3: (id, { q1, q2, q3, q4, q5 }) => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = ``;
            let height = container.style.height;

            let q2h = Number(q2.value) > Number(q3.value) ? 65 : 35;
            let q3h = Number(q3.value) > Number(q2.value) ? 65 : 35;
            if (Number(q2.value) == Number(q3.value)) {
                q2h = 50;
                q3h = 50;
            }

            let q4h = q3h;
            let transform4 = ``;
            let l2h = q3h;

            if (Number(q4.value) > Number(q3.value)) {
                q4h = (q3h + 15);
                transform4 = `rotate(-22deg) skew(-22deg)`;
                l2h = l2h + 5;
            } else if (Number(q4.value) < Number(q3.value)) {
                q4h = (q3h - 15);
                l2h = l2h - 10;
                transform4 = `rotate(15deg) skew(15deg)`;
            } else {
                l2h = l2h - 2;   
            }

            let q5h = q4h;
            let transform5 = ``;
            let l3h = l2h;
            
            if (Number(q5.value) > Number(q4.value)) {
                q5h = (q4h + 15);
                transform5 = `rotate(-22deg) skew(-22deg)`;
                l3h = l3h + 15;
            } else if (Number(q5.value) < Number(q4.value)) {
                q5h = (q4h - 15);
                l3h = l3h;
                transform5 = `rotate(22deg) skew(22deg)`;
            } else {
                l3h = l3h - 2 + 10; 
            }

            container.innerHTML = `<ul style="
                                            display: table;
                                            table-layout: fixed;
                                            width: 100%;
                                            margin: 0 auto;
                                            padding: 0px;"
                                        >
                                        <li style="
                                            position: relative;
                                            display: table-cell;
                                            vertical-align: bottom;
                                            height: ${ height };
                                            width: 22%;"
                                        >
                                            <div style="height:${ height }; border: 3px solid #7B1FA2; margin: 2px 1px; border-radius: 10px 0px 0px 10px; position: relative; padding: 2px;">
                                                <div style="text-align: center; color: darkgray;">${ q1.title }</div>
                                                <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; font-size: 1rem;">${ q1.text }</div>
                                            </div>
                                        </li>
                                        <li style="
                                            position: relative;
                                            display: table-cell;
                                            vertical-align: bottom;
                                            height: ${ height };
                                            width: 22%;"
                                        >
                                            <div style="height:${ q2h }%; border: 3px solid #4CAF50; margin: 2px 1px; border-radius: 0px 10px 0px 0px; position: relative; padding: 2px;">
                                                <div style="text-align: center; color: darkgray;">${ q2.title }</div>
                                                <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; font-size: 1rem;">${ q2.text }</div>
                                            </div>
                                            <div style="height:calc(${ q3h }% - 6px); border: 3px solid #03A9F4; margin: 2px 1px; border-radius: 0px 0px 10px 0px; position: relative; padding: 2px;">
                                                <div style="text-align: center; color: darkgray;">${ q3.title }</div>
                                                <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; font-size: 1rem;">${ q3.text }</div>
                                            </div>
                                        </li>
                                        <li style="
                                            position: relative;
                                            display: table-cell;
                                            vertical-align: bottom;
                                            height: ${ height };"
                                        >
                                        <div style="
                                            width: 100%;
                                            border-style: dotted;
                                            border-color: gray;
                                            border-bottom: 0;
                                            border-left: 0;
                                            border-right: 0;
                                            height: ${l2h}%;
                                            opacity: 0.7;
                                            transform: ${transform4};"
                                        ></div>
                                        <div style="
                                            width: 100%;
                                            border-style: dotted;
                                            border-color: gray;
                                            border-bottom: 0;
                                            opacity: 0.7;"
                                        ></div>
                                        </li>
                                        <li style="
                                            position: relative;
                                            display: table-cell;
                                            vertical-align: bottom;
                                            height: ${ height };"
                                        >

                                            <div>
                                                <p style="font-weight: 500; text-align: center;line-height: 15px;margin-bottom: 5px;">
                                                    ${q4.title}
                                                </p>
                                            </div>
                                            <div style="
                                                height: ${q4h}%;
                                                border: 3px solid #90caf9;
                                                border-radius: 0px 0px 10px 0px;
                                                -webkit-animation: draw 1s ease-in-out;
                                                animation: draw 1s ease-in-out;
                                                text-align: center;
                                                padding: 2px;
                                                position: relative; ">
                                                <div style="margin: 0; position: absolute; top: 45%; text-align: center; width: 100%; font-size: 0.75rem;">${ q4.text }</div>
                                            </div>
                                        </li>
                                        <li style="
                                            position: relative;
                                            display: table-cell;
                                            vertical-align: bottom;
                                            height: ${ height };"
                                        >
                                        <div style="
                                            width: 100%;
                                            border-style: dotted;
                                            border-color: gray;
                                            border-bottom: 0;
                                            border-left: 0;
                                            border-right: 0;
                                            height: ${l3h}%;
                                            opacity: 0.7;
                                            transform: ${transform5};"
                                        ></div>
                                        <div style="
                                            width: 100%;
                                            border-style: dotted;
                                            border-color: gray;
                                            border-bottom: 0;
                                            opacity: 0.7;"
                                        ></div>
                                        </li>
                                        <li style="
                                            position: relative;
                                            display: table-cell;
                                            vertical-align: bottom;
                                            height: ${ height };"
                                        >

                                            <div>
                                                <p style="font-weight: 500; text-align: center;line-height: 15px;margin-bottom: 5px;">
                                                    ${q5.title}
                                                </p>
                                            </div>
                                            <div style="
                                                height: ${q5h}%;
                                                border: 3px solid #90caf9;
                                                border-radius: 0px 0px 10px 0px;
                                                -webkit-animation: draw 1s ease-in-out;
                                                animation: draw 1s ease-in-out;
                                                text-align: center;
                                                padding: 2px;
                                                position: relative; ">
                                                <div style="margin: 0; position: absolute; top: 45%; text-align: center; width: 100%; font-size: 0.75rem;">${ q5.text }</div>
                                            </div>
                                        </li>
                                    </ul>`;
        }
    },
    square_: (id, { q1, q2, q3 }) => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = ``;
            let height = container.style.height;

            let q2h = Number(q2.value) > Number(q3.value) ? 70 : 30;
            let q3h = Number(q3.value) > Number(q2.value) ? 70 : 30;

            if (Number(q2.value) == Number(q3.value)) {
                q2h = 50;
                q3h = 50;
            }

            container.innerHTML = ` <div style="width:100%;display:flex;">
                                        <div style="width:60%;display:flex;">
                                            <div style="width:50%">
                                                <div style="height:${ height }; border: 3px solid #7B1FA2; margin: 2px 1px; border-radius: 10px 0px 0px 10px; position: relative; padding: 2px;">
                                                    <div style="text-align: center; color: darkgray;">${ q1.title }</div>
                                                    <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; font-size: 1.1rem;">${ q1.text }</div>
                                                </div>
                                            </div>
                                            <div style="width:50%">
                                                <div style="height:${ q2h }%; border: 3px solid #4CAF50; margin: 2px 1px; border-radius: 0px 10px 0px 0px; position: relative; padding: 2px;">
                                                    <div style="text-align: center; color: darkgray;">${ q2.title }</div>
                                                    <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; font-size: 1.1rem;">${ q2.text }</div>
                                                </div>
                                                <div style="height:calc(${ q3h }% - 6px); border: 3px solid #03A9F4; margin: 2px 1px; border-radius: 0px 0px 10px 0px; position: relative; padding: 2px;">
                                                    <div style="text-align: center; color: darkgray;">${ q3.title }</div>
                                                    <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; font-size: 1.1rem;">${ q3.text }</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="width:40%;">
                                            <div style=""></div>
                                            <div style="height:55%; border: 3px solid #90caf9; margin: 2px 1px; border-radius: 0px 0px 10px 0px; position: relative; padding: 2px; width:50%; float:right;">
                                                <div style="text-align: center; color: darkgray;">${ q1.title }</div>
                                                <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; font-size: 1.1rem;">${ q1.text }</div>
                                            </div>
                                        </div>
                                    </div>`;
        }
    },
    square__: (id, { q1, q2, q3 }) => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = ``;
            let height = container.style.height;

            let q2h = Number(q2.value) > Number(q3.value) ? 70 : 30;
            let q3h = Number(q3.value) > Number(q2.value) ? 70 : 30;

            if (Number(q2.value) == Number(q3.value)) {
                q2h = 50;
                q3h = 50;
            }

            /*container.innerHTML = ` <div style="width:100%;display:flex;">
                                        <div style="width:60%;display:flex;">
                                            <div style="width:50%">
                                                <div style="height:${ height }; border: 3px solid #7B1FA2; margin: 2px 1px; border-radius: 10px 0px 0px 10px; position: relative; padding: 2px;">
                                                    <div style="text-align: center; color: darkgray;">${ q1.title }</div>
                                                    <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; font-size: 1.1rem;">${ q1.text }</div>
                                                </div>
                                            </div>
                                            <div style="width:50%">
                                                <div style="height:${ q2h }%; border: 3px solid #4CAF50; margin: 2px 1px; border-radius: 0px 10px 0px 0px; position: relative; padding: 2px;">
                                                    <div style="text-align: center; color: darkgray;">${ q2.title }</div>
                                                    <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; font-size: 1.1rem;">${ q2.text }</div>
                                                </div>
                                                <div style="height:calc(${ q3h }% - 6px); border: 3px solid #03A9F4; margin: 2px 1px; border-radius: 0px 0px 10px 0px; position: relative; padding: 2px;">
                                                    <div style="text-align: center; color: darkgray;">${ q3.title }</div>
                                                    <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; font-size: 1.1rem;">${ q3.text }</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="width:40%;">
                                            <div style=""></div>
                                            <div style="height:55%; border: 3px solid #90caf9; margin: 2px 1px; border-radius: 0px 0px 10px 0px; position: relative; padding: 2px; width:50%; float:right;">
                                                <div style="text-align: center; color: darkgray;">${ q1.title }</div>
                                                <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; font-size: 1.1rem;">${ q1.text }</div>
                                            </div>
                                        </div>
                                    </div>`;*/
            container.innerHTML = `<ul style="
                                            display: table;
                                            table-layout: fixed;
                                            width: 70%;
                                            max-width: 900px;
                                            margin: 0 auto;
                                            padding: 0px;
                                            border-bottom: 2px solid #dee2e6;
                                            margin-bottom: 25px;
                                            width: 85%;"
                                        >
                                        <li style="
                                            position: relative;
                                            display: table-cell;
                                            vertical-align: bottom;
                                            height: 200px;"
                                        >
                                            <div style="height:${ height }; border: 3px solid #7B1FA2; margin: 2px 1px; border-radius: 10px 0px 0px 10px; position: relative; padding: 2px;">
                                                <div style="text-align: center; color: darkgray;">${ q1.title }</div>
                                                <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; font-size: 1.1rem;">${ q1.text }</div>
                                            </div>
                                        </li>
                                        <li style="
                                            position: relative;
                                            display: table-cell;
                                            vertical-align: bottom;
                                            height: 200px;"
                                        >
                                            <div style="height:${ q2h }%; border: 3px solid #4CAF50; margin: 2px 1px; border-radius: 0px 10px 0px 0px; position: relative; padding: 2px;">
                                                <div style="text-align: center; color: darkgray;">${ q2.title }</div>
                                                <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; font-size: 1.1rem;">${ q2.text }</div>
                                            </div>
                                            <div style="height:calc(${ q3h }% - 6px); border: 3px solid #03A9F4; margin: 2px 1px; border-radius: 0px 0px 10px 0px; position: relative; padding: 2px;">
                                                <div style="text-align: center; color: darkgray;">${ q3.title }</div>
                                                <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; font-size: 1.1rem;">${ q3.text }</div>
                                            </div>
                                        </li>
                                        <li style="
                                            position: relative;
                                            display: table-cell;
                                            vertical-align: bottom;
                                            height: 200px;"
                                        >
                                            <div class="chartTextTop">
                                                <span>6.09%</span>
                                            </div>
                                            <div title="MERCADO DESARROLLADO" style="
                                                height:121.8px; border: 2px solid #7DDDFF;    margin: 0 5em;
                                                display: block;
                                                background: rgba(209, 236, 250, 0.75);
                                                -webkit-animation: draw 1s ease-in-out;
                                                animation: draw 1s ease-in-out;
                                                padding: 0.2rem 0.5rem;
                                                border-bottom: 0px;
                                                background-color: #fff;
                                                text-align: center;
                                                overflow: hidden;
                                                margin-bottom: -1px;"
                                            >
                                            </div>
                                        </li>
                                        <li style="
                                            position: relative;
                                            display: table-cell;
                                            vertical-align: bottom;
                                            height: 200px;"
                                        >
                                            <div class="chartTextTop">
                                                <span>7.65%</span>
                                            </div>
                                            <div class="chartItem" style="height:153px; border: 2px solid #49FDAC;" title="MERCADO EMERGENTE">
                                            </div>
                                        </li>
                                        <li style="
                                            position: relative;
                                            display: table-cell;
                                            vertical-align: bottom;
                                            height: 200px;"
                                        >

                                            <div class="chartTextTop">
                                                <span>7.66%</span>
                                            </div>
                                            <div class="chartItem" style="height:153.2px; border: 2px solid #DA9EDA;
                                            display: block;
                                                background: rgba(209, 236, 250, 0.75);
                                                -webkit-animation: draw 1s ease-in-out;
                                                animation: draw 1s ease-in-out;
                                                padding: 0.2rem 0.5rem;
                                                border-bottom: 0px;
                                                background-color: #fff;
                                                text-align: center;
                                                overflow: hidden;
                                                margin-bottom: -1px;"
                                                title="EMPRESA">
                                            </div>
                                        </li>
                                    </ul>`;
        }
    },
    group: (id, { groups }) => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = ``;
            let height = container.offsetHeight, maxHeight = 0;
            let html = ``, t = groups.length;
            /*for (let i1 = 0; i1 < groups.length; i1++) {
                for (let i2 = 0; i2 < groups[i1].length; i2++) {
                    const el = groups[i1][i2];
                    if (Number(el.value) >= maxHeight) {
                        maxHeight = Number(el.value);
                    }
                }
            }*/
            for (let i1 = 0; i1 < groups.length; i1++) {
                for (let i2 = 0; i2 < groups[i1].length; i2++) {
                    // const el = groups[i1][i2];
                    // const percentage = (el.value * 100)/maxHeight;
                    // groups[i1][i2].height = (percentage * height)/100;
                    groups[i1][i2].height = groups[i1][i2].value * 15;

                }
            }
            groups.forEach((g1, i1) => {
                html += `<div style="
                                width:${100 / t}%;
                                float: left;
                        ">`;
                g1.forEach((g2, i2) => {
                    html += `
                    <div style="height:${ g2.height }px; border: 3px solid ${ g2.color }; margin: 2px 1px; border-radius: 5px; position: relative; padding: 1px;">
                        <div style="text-align: center; color: darkgray;">${ g2.title }</div>
                        <div style="margin: 0; position: absolute; top: 50%; text-align: center; width: 100%; ">${ g2.text }</div>
                    </div>`;
                });
                html += `</div>`;
            });
            container.innerHTML = html;
        }
    }
};