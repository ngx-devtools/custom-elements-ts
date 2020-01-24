import { CustomElement, Dispatch, DispatchEmitter, Listen } from 'custom-elements-ts'

import * as sinon from 'sinon'
import { expect } from 'chai'

describe('listen decorator', () => {
  let element: any

  @CustomElement({
    tag: 'btn-listen-dispatch',
    template: `<button>Test</button>`
  })
  class ButtonElement extends HTMLElement {
  
    @Dispatch() btnClick: DispatchEmitter;
    @Dispatch('btn.namedClick') btnClickNamed: DispatchEmitter;
  
    constructor() {
      super();
    }
  
    @Listen('click')
    btnHandler(){
      this.shadowRoot.querySelector('button').innerHTML = 'Hello';
    }
  
    @Listen('click', 'button')
    btnInnerClick() {}
  
  }

  beforeEach(() => {
    element = document.createElement('btn-listen-dispatch');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element)
    sinon.restore()
  });

  it('should call method decorated @Listen', () => {
    const btnHandlerSpy = sinon.spy(element.btnHandler,'call')

    element.click()
    sinon.assert.called(btnHandlerSpy)
  })

  it('should call method decorated @Listen on children element click', () => {
    const btnHandlerSpy = sinon.spy(element.btnHandler, 'call')

    element.shadowRoot.querySelector('button').click()
    sinon.assert.called(btnHandlerSpy)
  })

  it('should call method decorated @Listen on selector click', () => {
    const btnInnerSpy = sinon.spy(element.btnInnerClick,'call')

    element.shadowRoot.querySelector('button').click()
    sinon.assert.called(btnInnerSpy)
  });

  it('should execute inner method decorated @Listen', () => {
    element.click();
    expect(element.shadowRoot.querySelector('button').innerHTML).equal('Hello');
  })

})

describe('listen decorator no shadowroot', () => {
  let element: any

  @CustomElement({
    tag: 'btn-listen-shadow-false',
    template: `<button>Test</button>`,
    shadow: false
  })
  class ShadowFalseButtonElement extends HTMLElement {
  
    @Dispatch() btnClick: DispatchEmitter;
    @Dispatch('btn.namedClick') btnClickNamed: DispatchEmitter;
  
    constructor() {
      super();
    }
  
    @Listen('click')
    btnHandler(){
      this.querySelector('button').innerHTML = 'Hello';
    }
  
    @Listen('click', 'button')
    btnInnerClick() {}
  
  }

  beforeEach(() => {
    element = document.createElement('btn-listen-shadow-false');
    document.body.appendChild(element);
  })

  afterEach(() => {
    document.body.removeChild(element)
    sinon.restore()
  })

  it('should call method decorated @Listen', () => {
    const btnHandlerSpy = sinon.spy(element.btnHandler,'call')

    element.click()
    sinon.assert.called(btnHandlerSpy)
  })

  it('should call method decorated @Listen on children element click', () => {
    const btnHandlerSpy = sinon.spy(element.btnHandler,'call')

    element.querySelector('button').click()
    sinon.assert.called(btnHandlerSpy)
  })

  it('should call method decorated @Listen on selector click', () => {
    const btnInnerSpy = sinon.spy(element.btnInnerClick,'call')

    element.querySelector('button').click()
    sinon.assert.called(btnInnerSpy)
  })

  it('should execute inner method decorated @Listen', () => {
    element.click()
    expect(element.querySelector('button').innerHTML).equal('Hello');
  })

})