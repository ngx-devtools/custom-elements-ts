import { CustomElement, Toggle } from 'custom-elements-ts';

import { expect } from 'chai'

@CustomElement({})
class ToggleElement extends HTMLElement {

  @Toggle() disabled;

}

describe('toggle decorator', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('toggle-element')
    document.body.appendChild(element)
  });

  afterEach(() => {
    document.body.removeChild(element)
  });

  it('should return false on no attribute set', () => {
    expect(element.disabled).to.deep.equal(false);
  });

  it('should return true on empty attribute set', () => {
    element.setAttribute('disabled','');
    expect(element.disabled).to.deep.equal(true);
  });

  it('should return false on remove attribute', () => {
    element.removeAttribute('disabled');
    expect(element.disabled).to.deep.equal(false);
  });

  it('should return value on attribute set', () => {
    element.setAttribute('disabled','true');
    expect(element.disabled).to.deep.equal(true);
    element.setAttribute('disabled','false');
    expect(element.disabled).to.deep.equal(false);
  });

  it('should return false on random string attribute set', () => {
    let warn = console.warn;
    // suppressing warn
    console.warn = () => {};
    element.setAttribute('disabled','asd');
    expect(element.disabled).to.deep.equal(false);
    console.warn = warn;
  });

  it('should add attribute on empty prop set', () => {
    element.disabled = '';
    expect(element.hasAttribute('disabled')).to.deep.equal(true);
  });

  it('should remove attribute on null prop set', () => {
    element.disabled = null;
    expect(element.hasAttribute('disabled')).to.deep.equal(false);
  });

  it('should reflect prop to attribute', () => {
    element.disabled = true;
    expect(element.getAttribute('disabled')).to.deep.equal('true');
    element.disabled = false;
    expect(element.getAttribute('disabled')).to.deep.equal('false');
  });

  it('should reflect random string prop to attribute as false', () => {
    const warn = console.warn;
    console.warn = () => {};
    element.disabled = 'asd';
    expect(element.getAttribute('disabled')).to.deep.equal('false');
    console.warn = warn;
  });

});