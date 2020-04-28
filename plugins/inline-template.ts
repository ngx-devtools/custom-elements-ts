import * as ts from 'typescript'
import * as fs from 'fs'

import { resolve, dirname } from 'path'

function buildSass(content: string, srcFile: string): string {
  const nodeSassOptions = { data: content, file: srcFile, outputStyle: 'compressed' }
  return srcFile.endsWith('.scss')
      ? require('node-sass').renderSync(nodeSassOptions).css.toString()
      : content;
}

function inlineHTML(file: string, property: ts.PropertyAssignment) {
  property.name = ts.createIdentifier('template')
  const templateUrl = property.initializer.getText().replace(/'|"/g, '')
  const templateFullPath = resolve(dirname(file), templateUrl)
  property.initializer = ts.createStringLiteral(fs.readFileSync(templateFullPath, 'utf8'))
}

function inlineStyle(file: string, property: ts.PropertyAssignment) {
  property.name = ts.createIdentifier('style')
  const styleUrl = property.initializer.getText().replace(/'|"/g, '')
  const styleFullPath = resolve(dirname(file), styleUrl)
  const content = buildSass(fs.readFileSync(styleFullPath, 'utf8'), styleFullPath)
  property.initializer = ts.createStringLiteral(content)
}

function inline(file: string, property: ts.PropertyAssignment) {
  const text = property.getText()
  text.includes('templateUrl') && inlineHTML(file, property)
  text.includes('styleUrl') && inlineStyle(file, property)
}

export function inlineTemplate(file: string) {
  return (context: ts.TransformationContext) => {
    const visitor = (node: ts.Node) => {
      if (ts.isClassDeclaration(node) && Array.isArray(node.decorators)) {
        node.decorators.forEach(decorator => {
          const expression = (decorator.expression as ts.CallExpression)
          if (expression.expression.getText().includes('CustomElement')) {
            expression.arguments.forEach(argument => {
              ts.isObjectLiteralExpression(argument) 
                && argument.properties.forEach((property: ts.PropertyAssignment) => inline(file, property))
            })
          }
        }) 
      }
      return ts.visitEachChild(node, (child) => visitor(child), context);
    }
    return visitor
  }
}