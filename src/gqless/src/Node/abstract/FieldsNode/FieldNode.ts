import { Node } from '../Node'
import { NodeContainer } from '../NodeContainer'
import { FieldSelection, Selection } from '../../../Selection'
import { Arguments } from '../..'
import { Accessor, FieldAccessor } from '../../../Accessor'
import { Outputable } from '../Outputable'
import { FieldsNode } from './FieldsNode'
import { invariant } from '@gqless/utils'
import { Mix, Generic } from 'mix-classes'
import { ScalarNode } from '../../ScalarNode'
import { EnumNode } from '../../EnumNode'
import { isArgsEqual } from './isArgsEqual'

export interface FieldNode<TNode extends Node<any> = any>
  extends NodeContainer<TNode> {}

export class FieldNode<TNode> extends Mix(Generic(NodeContainer), Outputable) {
  // This is set inside FieldsNode
  public name: string = ''

  constructor(node: TNode, public args?: Arguments, nullable?: boolean) {
    super([node, nullable])
  }

  public getSelection(
    fieldsAccessor: Accessor,
    args?: Record<string, any>
  ): { justCreated: boolean; selection: FieldSelection<TNode> } {
    const selection = fieldsAccessor.selection.getField(selection => {
      if (!(selection instanceof FieldSelection)) return false

      return (
        selection.field.name === this.name && isArgsEqual(selection.args, args)
      )
    })! as FieldSelection<TNode>

    if (selection) return { justCreated: false, selection }

    return {
      justCreated: true,
      selection: new FieldSelection(
        fieldsAccessor.selection,
        this.ofNode,
        this,
        args
      ),
    }
  }

  public getData(fieldsAccessor: Accessor<Selection<FieldsNode>>) {
    super.getData(fieldsAccessor)

    const getData = (selection: FieldSelection<TNode>): any => {
      const accessor =
        fieldsAccessor.getChild(a => a.selection === selection) ||
        new FieldAccessor(fieldsAccessor, selection)

      return ((this.ofNode as unknown) as Outputable).getData(accessor)
    }

    const createArgsFn = (handler?: (args: any) => void) => (args: any) => {
      const parsedArgs = args && Object.keys(args).length ? args : undefined

      handler && handler(parsedArgs)

      return getData(this.getSelection(fieldsAccessor, parsedArgs).selection)
    }

    // If the arguments are required, skip creating an argumentless selection
    if (
      this.args &&
      (this.args.required ||
        this.ofNode instanceof ScalarNode ||
        this.ofNode instanceof EnumNode)
    ) {
      return createArgsFn()
    }

    // Create an argumentless selection, that will be destroyed if
    // the callback function is called
    const argumentless = this.getSelection(fieldsAccessor)
    const argumentlessData = getData(argumentless.selection)

    if (this.args)
      return new Proxy(
        createArgsFn(args => {
          // If we just created the argumentless selection
          // + it didn't already exist then destroy it, as it's not required
          if (args && argumentless.justCreated) {
            argumentless.selection.unselect()
          }
        }),
        {
          get: (_, prop) => {
            invariant(
              argumentlessData,
              `Cannot read property '${String(prop)}' on null [${
                argumentless.selection.path
              }]\n\n` +
                `You should check for null using \`${
                  argumentless.selection
                }() && ${argumentless.selection}().${String(prop)}\``
            )

            const result = argumentlessData[prop]

            if (typeof result === 'function') {
              return result.bind(argumentlessData)
            }

            return result
          },
          set: (_, prop, value) => {
            invariant(
              argumentlessData,
              `Cannot set property '${String(prop)}' on null [${
                argumentless.selection.path
              }]\n\n` +
                `You should check for null using \`${
                  argumentless.selection
                }() && ${argumentless.selection}().${String(prop)}\``
            )

            return (argumentlessData[prop] = value)
          },
        }
      )

    return argumentlessData
  }
}
