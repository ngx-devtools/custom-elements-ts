import { CustomElement, Toggle, Prop, Watch } from 'custom-elements-ts';
import { expect, assert } from 'chai'

@CustomElement({})
class InitElement extends HTMLElement {

  @Toggle() disabled = true;
  @Prop() color = 'blue';
  @Prop() icon;

  setIcon = false;
  @Watch('icon')
  changeIcon(_value) {
    this.setIcon = true;
  }

  constructor(){
    super();
  }

  connectedCallback() {}
}

describe('init state', () => {
  let myElement: any

  beforeEach(() => {
    myElement = document.createElement('init-element');
  });

  afterEach(() => {
    document.body.innerHTML = ''
  });

  it('should set attribute based on default prop value on init', () => {
    const element = document.body.appendChild(myElement);
    expect(element.getAttribute('color')).equal('blue');
  });

  it('should set default prop value on init', () => {
    const element = document.body.appendChild(myElement);
    expect(element.color).equal('blue');
  });

  it('should set attribute based on default toggle value on init', () => {
    const element = document.body.appendChild(myElement);
    expect(element.hasAttribute('disabled')).equal(true);
  });

  it('should set default toggle value on init', () => {
    const element = document.body.appendChild(myElement);
    expect(element.disabled).equal(true);
  });

  it('should reflect attribute to props on init', () => {
    myElement.setAttribute('color','red');
    const element = document.body.appendChild(myElement);
    expect(element.color).equal('red');
  });

  it('should not set attribute on second element instance', () => {
    document.body.innerHTML = `
      <init-element icon="awesome" disabled="false"></init-element>
      <init-element></init-element>
      <init-element></init-element>
    `;
    const initElements: any = document.body.querySelectorAll('init-element');
    expect(initElements[1].icon).to.be.null
    expect(initElements[2].icon).to.be.null
  });

  it('should reflect has attribute to toggle on init', () => {
    myElement.setAttribute('disabled','');
    const element = document.body.appendChild(myElement);
    expect(element.disabled).equal(true);
  });

  it('should reflect true attribute to toggle on init', () => {
    myElement.setAttribute('disabled','true');
    const element = document.body.appendChild(myElement);
    expect(element.disabled).equal(true);
  });

  it('should reflect false attribute to toggle on init', () => {
    myElement.setAttribute('disabled','false');
    const element = document.body.appendChild(myElement);
    expect(element.disabled).equal(false);
  });

  it('should execute watch of attribute on init', () => {
    myElement.setAttribute('icon','test');
    const element = document.body.appendChild(myElement);
    expect(element.setIcon).equal(true);
  });

});