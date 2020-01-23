import { CustomElement, Dispatch, DispatchEmitter, Listen } from 'custom-elements-ts';
import { expect } from 'chai'

@CustomElement({
  tag: 'btn-dispatch',
  template: `<button>Test</button>`
})
class DispatchElement extends HTMLElement {

  @Dispatch() btnClick: DispatchEmitter;
  @Dispatch('btn.namedClick') btnClickNamed: DispatchEmitter;

  constructor() {
    super()
  }

  @Listen('click')
  btnHandler(){
    this.shadowRoot.querySelector('button').innerHTML = 'Hello'
    this.btnClick.emit({detail: 'Hello'})
    this.btnClickNamed.emit({detail: 'Hello from named click'})
  }
}

describe('dispatch decorators', () => {
  let element: HTMLElement

  beforeEach(() => {
    element = document.createElement('btn-dispatch');
    document.body.appendChild(element);
  })

  afterEach(() => {
    document.body.removeChild(element)
  })

  it('should trigger a btn.click DispatchEmitter', (done) => {
    element.addEventListener('btn.click', (e) => {
      /// @ts-ignore
      expect(e.detail).equal('Hello');
      done()
    })
    element.click()
  })

  it('should trigger a btn.namedClick DispatchEmitter', (done) => {
    element.addEventListener('btn.namedClick', (e) => {
      /// @ts-ignore
      expect(e.detail).equal('Hello from named click');
      done()
    })
    element.click()
  })

})