'use strict';

class Button extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <button onClick={this.props.action} type={this.props.type}>{this.props.wording}</button>
        )
    }

}

class Formulaire extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            data: {},
            otherVisibility: false,
            emptyFields: []
        };

        this.steps = [
            {
                name: "Étape 1",
                inputs: [
                    {
                        name: "civil",
                        label: "Civilité",
                        type: "select",
                        values: ["Femme", "Homme", "Autre"]
                    },
                    {
                        name: "firstname",
                        label: "Prénom",
                        type: "text",
                        required: true
                    },
                    {
                        name: "lastname",
                        label: "Nom",
                        type: "text",
                        required: true
                    },
                    {
                        name: "mail",
                        label: "E-mail",
                        type: "email",
                        required: true
                    },
                    {
                        name: "phone",
                        label: "Téléphone",
                        type: "phone",
                        placeholder: "06 __ __ __ __"
                    }
                ]
            },
            {
                name: "Étape 2",
                inputs: [
                    {
                        name: "framework",
                        label: "Framework préféré",
                        type: "radio",
                        values: ["Vue", "Angular", "Symfony", "Autre"]
                    },
                    {
                        name: "other",
                        label: "Autre",
                        type: "text"
                    },
                ]
            },
            {
                name: "Récap",
            }
        ];
    }

    initState = () => {
        const datas = {};
        for (let i = 0, l = this.steps.length; i < l; i++) {
            const inputs = this.steps[i].inputs; 
            if (this.steps[i].inputs) {
                for (let y = 0, n = inputs.length; y < inputs.length; y++) {
                    const input = inputs[y];

                    if (input.values) {
                        datas[input.name] = input.values[0];
                    } else {
                        datas[input.name] = '';
                    }
    
                }
            }
        }


        this.setState({
            data: datas
        });
    }

    componentWillMount() {
        this.initState();
    }

    _onChange = (e) => {
        var name = e.target.name;
        var value = e.target.value;

        if (name === 'phone') {
            var phone = value.replace(/\s/g, '');
            value = phone.replace(/(.{2})/g,"$1 ").replace(/\s+$/, '');
        }

        if (name === 'framework') {
            if (value === 'Autre') {
                this.setState({
                    otherVisibility : true
                });
            } else {
                this.setState({
                    otherVisibility : false
                });
            }
        }

        var new_data = {...this.state.data, [name]: value}
        this.setState({
            data: new_data
        })
    }

    _save = () => {
        fetch('http://localhost:3000/form/', {
            method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state.data)
            })
            .then((response) => response.json())
            .then((json) => alert('Sauvegarde ok !'))
            .catch((error) => console.error(error))
    }

    _displayRecap = () => {
        var datas = [];

        Object.keys(this.state.data).map((objectKey, index) => {
            
            var value = this.state.data[objectKey];
            if (objectKey === 'framework' && this.state.data.framework === 'Autre') {
                value = this.state.data['other'];
            }
            if (objectKey !== 'other') {
                datas.push(<li key={objectKey}><strong>{objectKey}</strong>: {value}</li>)
            }
        });

        return (
            <div>
                <ul>
                    {datas}
                </ul>
                <Button key="btn1" wording="Sauvegarder" action={this._save} type="button"/>
            </div>
        )
    }

    _nextTab = (e) => {
        e.preventDefault();
        const inputs = this.steps[this.state.step].inputs;
        const emptyFields = [];

        for (let i = 0, l = inputs.length; i < l; i++) {
            const input = inputs[i];
            const value = this.state.data[input.name];
            if (input.required) {
                if (value.length === 0) {
                    emptyFields.push(input.name);
                }
            }

            if (input.type === 'email') {
                var regex = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi);

                if(!regex.test(value)) {
                    emptyFields.push(input.name);
                }
            }

            if (input.type === 'phone' && value.length > 0) {
                var phone = value.replace(/\s/g, '');
                if (!phone.match(/^[0-9]{10}$/)) {
                    emptyFields.push(input.name);
                }
            }
        }

        this.setState({
            emptyFields
        })

        if (emptyFields.length === 0) {
            this.setState({
                step: this.state.step + 1
            })
        }
    }

    _prevTab = () => {
        this.setState({
            step: this.state.step - 1
        })
    }

    _displayButtons = () => {
        var buttons = [];

        if (this.state.step > 0) {
            buttons.push(<Button key="btn2" wording="Précédent" action={this._prevTab} type="button" />)
        }

        if (this.state.step < (this.steps.length - 1)) {
            buttons.push(<Button key="btn1" wording="Suivant" action={this._nextTab} type="submit"/>)
        }

        return buttons;
    }


    _label = (input) => {
        return <label htmlFor={input.name}>{input.required ? '* ' : ''}{input.label} : </label>
    }

    _showInputs = () => {
        const stepInputs = this.steps[this.state.step].inputs
        const inputs = [];
        for (let i = 0, l = stepInputs.length; i < l; i++) {
            const input = stepInputs[i];
            const placeholder = (input.placeholder) ? input.placeholder : input.label;


            const commonProps = {
                onChange: this._onChange,
                value: this.state.data[input.name],
                type: input.type,
                name: input.name,
                placeholder: placeholder
            }

            switch (input.type) {
                case 'select':
                    const options = input.values.map((value) => {
                        return (<option key={"option_" + value}>{value}</option>)
                    });
                    var htmlInput = <select {...commonProps}>{options}</select>
                    break;

                case 'radio':
                    const radio = input.values.map((value) => {
                        commonProps.value = value;
                        return (<p key={"radio_" + value} >
                                <input id={"radio_" + value} {...commonProps} checked={this.state.data[input.name] === value}/> 
                                <label className="label-radio" htmlFor={"radio_" + value}>{input.required ? '* ' : ''}{value}</label>
                            </p>)
                    });
                    var htmlInput = <div>{radio}</div>
                    break;

                default:
                    var htmlInput = <input {...commonProps} />
                    break;
            }

            if (input.name !== 'other' || this.state.otherVisibility) {
                const isError = this.state.emptyFields.indexOf(input.name) !== -1 ? ' error' : '';
                inputs.push(<div className={"input-container" + isError} key={"input_" + i}> {this._label(input)} {htmlInput} </div>)
            }

        }

        return inputs;
    }


    render() {
        const currentStep = this.steps[this.state.step];
        const stepName = currentStep.name;

        return (
            <main className={"step-" + (this.state.step + 1)}>
                <form onSubmit={this._nextTab}>
                    <nav>
                        <h1>{stepName} ({this.state.step + 1}/{this.steps.length})</h1>
                    </nav>

                    <section>
                        {(currentStep.inputs) ? this._showInputs() : this._displayRecap()}
                    </section>
                    <footer>
                        {this._displayButtons()}
                    </footer>
                </form>
            </main>
        );
    }
}

let domContainer = document.querySelector('#formulaire');
ReactDOM.render(<Formulaire />, domContainer);