import { CustomElement } from 'custom-elements-ts'
import { expect, assert } from 'chai'

function createElement(tag: string) {
  const element = document.createElement(tag)
  document.body.appendChild(element)
  return element
}

describe('basic test', () => {
  let element: HTMLElement

  @CustomElement({
    tag: 'basic-element',
    template: '<span>my element</span>',
    style: ':host{border:0}'
  })
  class BasicElement extends HTMLElement {}

  beforeEach(() => {
    element = createElement('basic-element')
  })

  afterEach(() => {
    document.body.removeChild(element)
  })

  it('should load html template', () => {
      expect(element.shadowRoot.innerHTML).contain('<span>my element</span>');
  })

  it('should load css', () => {
    const style = element.shadowRoot.querySelector('style')
    expect(style.innerText).contain(':host{border:0}');
  })

  it('should have shadowRoot', () => {
    assert.ok(element.shadowRoot)
  })
})

describe('basic test no shadowroot', () => {
  let element: HTMLElement

  @CustomElement({
    tag: 'shadow-false-element',
    template: '<span>my element</span>',
    style: ':host{border:0}',
    shadow: false
  })
  class ShadowFalseElement extends HTMLElement {}

  beforeEach(() => {
    element = createElement('shadow-false-element')
  });

  afterEach(() => {
    document.body.removeChild(element)
  })

  it('should load html template', () => {
    expect(element.innerHTML).contain('<span>my element</span>');
  })

  it('should have css', () => {
    assert.ok(element.querySelector('style'))
  })

  it('shadow not have a shadowroot', () => {
    expect(element.shadowRoot).to.be.null
  })
});