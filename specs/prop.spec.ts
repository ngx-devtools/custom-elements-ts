import { CustomElement, Prop } from 'custom-elements-ts';

import { expect, assert } from 'chai'

@CustomElement({
  tag: 'prop-element',
  template: '<span>my element</span>',
  style: ':host{border:0}'
})
class PropElement extends HTMLElement {

  @Prop() name;
  @Prop() maxFileSize;

  @Prop() objectProp;
  @Prop() init = 'blue';

  @Prop() kebabCase = 'kebab';

}

describe('prop decorator', () => {
  let element: any

  beforeEach(() => {
    element = document.createElement('prop-element');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element)
  });

  it('should reflect as property', () => {
    element.setAttribute('name', 'Mario')
    expect(element.getAttribute('name')).equal('Mario')

    element.setAttribute('name', 'Luigi');
    expect(element.name).equal('Luigi');
  });

  it('should reflect as attribute', () => {
    element.name = 'Aivan'
    expect(element.getAttribute('name')).equal('Aivan')

    element.name = 'Custom Elements'
    expect(element.getAttribute('name')).equal('Custom Elements')
  });

  it('should not reflect as attribute', () => {
    element.name = {};
    expect(element.getAttribute('name')).to.be.null
  });

  it('should properly set camelcase properties', () => {
    element.maxFileSize = 1;
    expect(element.maxFileSize).equal(1);
  });

  it('should properly get camelcase properties as kebabcase attributes', () => {
    element.maxFileSize = 1;
    expect(element.getAttribute('max-file-size')).equal('1');
  });

  it('should properly set kebabcase attributes as camelcase properties', () => {
    element.setAttribute('max-file-size', 2);
    expect(element.maxFileSize).equal(2);
  });

  it('should evaluate property', () => {
    element.objectProp = {name: 'Name'};
    expect(element.objectProp.name).equal('Name');
  });

  it('should change attribute on attribute change', () => {
    element.setAttribute('init', 'red');
    expect(element.init).equal('red');
    expect(element.getAttribute('init')).equal('red');
  });

  it('should change property via kebab attribute', () => {
    element.setAttribute('kebab-case', 'shawarma');
    expect(element.kebabCase).equal('shawarma');
  });

});