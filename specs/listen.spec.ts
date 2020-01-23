import { CustomElement, Dispatch, DispatchEmitter, Listen } from 'custom-elements-ts'

import * as sinon from 'sinon'
import { expect } from 'chai'

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

describe('listen decorator', () => {
  let element: any;

  beforeEach(() => {
    element = document.createElement('btn-listen-dispatch');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should call method decorated @Listen', () => {
    const btnHandlerSpy = sinon.spy(element.btnHandler,'call');
    element.click()
    expect(btnHandlerSpy.calledWith('call')).to.be.ok
  })

})