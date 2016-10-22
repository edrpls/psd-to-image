import 'jsdom-global/register';
import cleanup from 'jsdom-global';

import React from 'react';
import ReactDOM from 'react-dom';

import chai from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai)

import { Login } from 'components/login/Login';

describe.only('<Login />', function () {
    const should = chai.should();

    it('mounts', function () {
        const mountStub = sinon.stub(Login.prototype, 'componentDidMount');
        const wrapper = mount(<Login />);
        mountStub.should.have.been.calledOnce;
        Login.prototype.componentDidMount.restore();
    });

    it('gets is state from the AuthStore', () => {
        const wrapper = mount(<Login />);
        console.log(wrapper);
        wrapper.state.should.have.property('user', false);
        //expect(component.state.user).to.be.false
        //expect(component.state.message).to.be.null
    });

    /*
    it('mounts', () => {
        let login = findByClass(component, 'Login');
        let inputs = findByTag(component, 'input');
        expect(login).to.have.length(1);
        expect(inputs).to.have.length(3);
    });

    it('calls the AuthActions.login method', () => {
        let loginStub = sandbox.stub(AuthActions, 'login');
        let form = findByTag(component, 'form')[0];
        simulate().submit(form);
        expect(loginStub.called).to.be.true;
    });

    it('tries to redirect if a user and pathName exist', () => {
        let replaceStateStub = component.props.history.replaceState;
        expect(replaceStateStub.called).to.be.false;
        component = mount(Login, Object.assign({}, component.props, {
            location: {
                state: {nextPathname: '/test'}
            }
        }));
        let nextState = {user: true};
        component.componentWillUpdate(component.props, nextState);
        let [arg1, arg2] = replaceStateStub.args[0];
        expect(replaceStateStub.called).to.be.true;
        expect(arg1).to.be.null;
        expect(arg2).to.equal('/test');
    });

    it('tries to redirect to "/" if a user exists', () => {
        let replaceStateStub = component.props.history.replaceState;
        expect(replaceStateStub.called).to.be.false;
        component = mount(Login, Object.assign({}, component.props, {
            location: {
                state: {}
            }
        }));
        let nextState = {user: true};
        component.componentWillUpdate(component.props, nextState);
        let [arg1, arg2] = replaceStateStub.args[0];
        expect(replaceStateStub.called).to.be.true;
        expect(arg1).to.be.null;
        expect(arg2).to.equal('/');
    });

    // TBD
    it('validates the email field');
    it('validates the password field');
    it('shows an error message on errors');
    */

});
