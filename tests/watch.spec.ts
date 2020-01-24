import { CustomElement, Prop, Toggle, Watch } from 'custom-elements-ts';

import * as sinon from 'sinon'
import { expect, assert } from 'chai'


@CustomElement({
  tag: 'watch-element',
  template: '<span>my element</span>',
  style: ':host{border:0}'
})
class WatchElement extends HTMLElement {

  @Prop() name;

  @Watch('name')
  setSpan(value){
    const span = this.shadowRoot.querySelector('span');
    span.innerHTML = value.new;
  }

  set label(value: any) {
    this.setAttribute('label', value);
  }
  get label(): any {
    return this.getAttribute('label') || '';
  }

  newLabel = '';
  @Watch('label')
  setLabel(value) {
    this.newLabel = value.new;
  }


  newColor = '';
  @Prop() color = 'blue';
  @Watch('color')
  changeColor() {
    this.newColor = this.color;
  }

  caseChanged = false;
  @Prop() setCase;
  @Watch('setCase')
  changeCase(value) {
    this.caseChanged = this.setCase === value.new;
  }

  @Watch('set-kebab')
  changeKebabCase(value) {
    this.caseChanged = this.setCase === value.new;
  }

  menuChanged = false;
  @Prop() menus = 'a';
  @Watch('menus')
  changeMenus(value) {
    this.menuChanged = this.menus === value.new;
  }

  enabledChanged = false;
  @Toggle() enabled;
  @Watch('enabled')
  changeEnable(value) {
    this.enabledChanged = this.enabled.toString() === value.new;
  }
}

describe('watch decorator', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('watch-element');
    document.body.appendChild(element)
  });

  afterEach(() => {
    document.body.removeChild(element)
    sinon.restore()
  });

  it('should re-render setting property', () => {
    element.name = 'Aivan';
    expect(element.shadowRoot.querySelector('span').innerHTML).to.equal('Aivan');
  });

  it('should call method decorated with @Watch on prop change', () => {
    const watchSpy = sinon.spy(element,'setSpan')
    
    element.name = 'Aivan'
    sinon.assert.called(watchSpy)
  })

  it('should call method decorated with @Watch on prop change', () => {
    const watchSpy = sinon.spy(element,'setSpan');
    element.setAttribute('name', 'Mario');
    
    sinon.assert.calledWith(watchSpy, ...[{ old: null, new: 'Mario'}])
    expect(element.name).to.equal('Mario');
  });

  it('should call @Watch on attribute change with new property value', () => {
    element.setAttribute('color', 'red');
    expect(element.newColor).to.equal('red');
  });

  it('should call @Watch for plain get/set with correct value.new', () => {
    element.setAttribute('label', 'Name');
    expect(element.newLabel).to.equal('Name');
  });

  it('should call non kebab @Watch on kebab attribute change with new property value', () => {
    element.setAttribute('set-case', 'kebab');
    expect(element.setCase).to.equal('kebab');
    assert.ok(element.caseChanged)
  });

  it('should call kebab @Watch on kebab attribute change with new property value', () => {
    element.setAttribute('set-case', 'snake');
    expect(element.setCase).to.equal('snake');
    assert.ok(element.caseChanged)
  });

  it('should call @Watch on property change with new property value', () => {
    const menus = [
      {
        text: 'Colors',
        link: '/user-interface/style-guides/colors'
      },
      {
        text: 'Logo',
        link: '/user-interface/style-guides/logo'
      }
    ];
    element.menus = menus;
    expect(element.menus).to.equal(menus);
    assert.ok(element.menuChanged)
  });

  it('should call @Watch on toggle attribute with new property value', () => {
    element.enabled = true
    assert.ok(element.enabledChanged)
  });

});