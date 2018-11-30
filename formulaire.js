'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Button = function (_React$Component) {
    _inherits(Button, _React$Component);

    function Button(props) {
        _classCallCheck(this, Button);

        return _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, props));
    }

    _createClass(Button, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "button",
                { onClick: this.props.action, type: this.props.type },
                this.props.wording
            );
        }
    }]);

    return Button;
}(React.Component);

var Formulaire = function (_React$Component2) {
    _inherits(Formulaire, _React$Component2);

    function Formulaire(props) {
        _classCallCheck(this, Formulaire);

        var _this2 = _possibleConstructorReturn(this, (Formulaire.__proto__ || Object.getPrototypeOf(Formulaire)).call(this, props));

        _this2.initState = function () {
            var datas = {};
            for (var i = 0, l = _this2.steps.length; i < l; i++) {
                var inputs = _this2.steps[i].inputs;
                if (_this2.steps[i].inputs) {
                    for (var y = 0, n = inputs.length; y < inputs.length; y++) {
                        var input = inputs[y];

                        if (input.values) {
                            datas[input.name] = input.values[0];
                        } else {
                            datas[input.name] = '';
                        }
                    }
                }
            }

            _this2.setState({
                data: datas
            });
        };

        _this2._onChange = function (e) {
            var name = e.target.name;
            var value = e.target.value;

            if (name === 'phone') {
                var phone = value.replace(/\s/g, '');
                value = phone.replace(/(.{2})/g, "$1 ").replace(/\s+$/, '');
            }

            if (name === 'framework') {
                if (value === 'Autre') {
                    _this2.setState({
                        otherVisibility: true
                    });
                } else {
                    _this2.setState({
                        otherVisibility: false
                    });
                }
            }

            var new_data = Object.assign({}, _this2.state.data, _defineProperty({}, name, value));
            _this2.setState({
                data: new_data
            });
        };

        _this2._save = function () {
            fetch('http://localhost:3000/form/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(_this2.state.data)
            }).then(function (response) {
                return response.json();
            }).then(function (json) {
                return alert('Sauvegarde ok !');
            }).catch(function (error) {
                return console.error(error);
            });
        };

        _this2._displayRecap = function () {
            var datas = [];

            Object.keys(_this2.state.data).map(function (objectKey, index) {

                var value = _this2.state.data[objectKey];
                if (objectKey === 'framework' && _this2.state.data.framework === 'Autre') {
                    value = _this2.state.data['other'];
                }
                if (objectKey !== 'other') {
                    datas.push(React.createElement(
                        "li",
                        { key: objectKey },
                        React.createElement(
                            "strong",
                            null,
                            objectKey
                        ),
                        ": ",
                        value
                    ));
                }
            });

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "ul",
                    null,
                    datas
                ),
                React.createElement(Button, { key: "btn1", wording: "Sauvegarder", action: _this2._save, type: "button" })
            );
        };

        _this2._nextTab = function (e) {
            e.preventDefault();
            var inputs = _this2.steps[_this2.state.step].inputs;
            var emptyFields = [];

            for (var i = 0, l = inputs.length; i < l; i++) {
                var input = inputs[i];
                var value = _this2.state.data[input.name];
                if (input.required) {
                    if (value.length === 0) {
                        emptyFields.push(input.name);
                    }
                }

                if (input.type === 'email') {
                    var regex = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi);

                    if (!regex.test(value)) {
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

            _this2.setState({
                emptyFields: emptyFields
            });

            if (emptyFields.length === 0) {
                _this2.setState({
                    step: _this2.state.step + 1
                });
            }
        };

        _this2._prevTab = function () {
            _this2.setState({
                step: _this2.state.step - 1
            });
        };

        _this2._displayButtons = function () {
            var buttons = [];

            if (_this2.state.step > 0) {
                buttons.push(React.createElement(Button, { key: "btn2", wording: "Pr\xE9c\xE9dent", action: _this2._prevTab, type: "button" }));
            }

            if (_this2.state.step < _this2.steps.length - 1) {
                buttons.push(React.createElement(Button, { key: "btn1", wording: "Suivant", action: _this2._nextTab, type: "submit" }));
            }

            return buttons;
        };

        _this2._label = function (input) {
            return React.createElement(
                "label",
                { htmlFor: input.name },
                input.required ? '* ' : '',
                input.label,
                " : "
            );
        };

        _this2._showInputs = function () {
            var stepInputs = _this2.steps[_this2.state.step].inputs;
            var inputs = [];

            var _loop = function _loop(i, l) {
                var input = stepInputs[i];
                var placeholder = input.placeholder ? input.placeholder : input.label;

                var commonProps = {
                    onChange: _this2._onChange,
                    value: _this2.state.data[input.name],
                    type: input.type,
                    name: input.name,
                    placeholder: placeholder
                };

                switch (input.type) {
                    case 'select':
                        var options = input.values.map(function (value) {
                            return React.createElement(
                                "option",
                                { key: "option_" + value },
                                value
                            );
                        });
                        htmlInput = React.createElement(
                            "select",
                            commonProps,
                            options
                        );

                        break;

                    case 'radio':
                        var radio = input.values.map(function (value) {
                            commonProps.value = value;
                            return React.createElement(
                                "p",
                                { key: "radio_" + value },
                                React.createElement("input", Object.assign({ id: "radio_" + value }, commonProps, { checked: _this2.state.data[input.name] === value })),
                                React.createElement(
                                    "label",
                                    { className: "label-radio", htmlFor: "radio_" + value },
                                    input.required ? '* ' : '',
                                    value
                                )
                            );
                        });
                        htmlInput = React.createElement(
                            "div",
                            null,
                            radio
                        );

                        break;

                    default:
                        htmlInput = React.createElement("input", commonProps);

                        break;
                }

                if (input.name !== 'other' || _this2.state.otherVisibility) {
                    var isError = _this2.state.emptyFields.indexOf(input.name) !== -1 ? ' error' : '';
                    inputs.push(React.createElement(
                        "div",
                        { className: "input-container" + isError, key: "input_" + i },
                        " ",
                        _this2._label(input),
                        " ",
                        htmlInput,
                        " "
                    ));
                }
            };

            for (var i = 0, l = stepInputs.length; i < l; i++) {
                var htmlInput;
                var htmlInput;
                var htmlInput;

                _loop(i, l);
            }

            return inputs;
        };

        _this2.state = {
            step: 0,
            data: {},
            otherVisibility: false,
            emptyFields: []
        };

        _this2.steps = [{
            name: "Étape 1",
            inputs: [{
                name: "civil",
                label: "Civilité",
                type: "select",
                values: ["Femme", "Homme", "Autre"]
            }, {
                name: "firstname",
                label: "Prénom",
                type: "text",
                required: true
            }, {
                name: "lastname",
                label: "Nom",
                type: "text",
                required: true
            }, {
                name: "mail",
                label: "E-mail",
                type: "email",
                required: true
            }, {
                name: "phone",
                label: "Téléphone",
                type: "phone",
                placeholder: "06 __ __ __ __"
            }]
        }, {
            name: "Étape 2",
            inputs: [{
                name: "framework",
                label: "Framework préféré",
                type: "radio",
                values: ["Vue", "Angular", "Symfony", "Autre"]
            }, {
                name: "other",
                label: "Autre",
                type: "text"
            }]
        }, {
            name: "Récap"
        }];
        return _this2;
    }

    _createClass(Formulaire, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            this.initState();
        }
    }, {
        key: "render",
        value: function render() {
            var currentStep = this.steps[this.state.step];
            var stepName = currentStep.name;

            return React.createElement(
                "main",
                { className: "step-" + (this.state.step + 1) },
                React.createElement(
                    "form",
                    { onSubmit: this._nextTab },
                    React.createElement(
                        "nav",
                        null,
                        React.createElement(
                            "h1",
                            null,
                            stepName,
                            " (",
                            this.state.step + 1,
                            "/",
                            this.steps.length,
                            ")"
                        )
                    ),
                    React.createElement(
                        "section",
                        null,
                        currentStep.inputs ? this._showInputs() : this._displayRecap()
                    ),
                    React.createElement(
                        "footer",
                        null,
                        this._displayButtons()
                    )
                )
            );
        }
    }]);

    return Formulaire;
}(React.Component);

var domContainer = document.querySelector('#formulaire');
ReactDOM.render(React.createElement(Formulaire, null), domContainer);