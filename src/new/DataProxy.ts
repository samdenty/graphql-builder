import { Node, NodeDataType } from './Node'
import { ArrayNode, ObjectNode } from './nodes'
import { InnerNode } from './NodeContainer'
import { FieldsNode, FieldNode } from './FieldsNode'
import { Arguments } from './Arguments'

type RequiredKeys<T> = {
  [K in keyof T]-?: ({} extends { [P in K]: T[K] } ? never : K)
}[keyof T]

interface DataNodeCallbackOptions {
  alias?: string
}

type FieldCallback<
  TNode extends FieldNode<any, any, any>
> = TNode extends FieldNode<any, Arguments<infer TArgs, any>, any>
  ? (RequiredKeys<TArgs> extends never
      ? (
          args?: TArgs,
          options?: DataNodeCallbackOptions
        ) => FieldValueProxy<TNode>
      : (
          args: TArgs,
          options?: DataNodeCallbackOptions
        ) => FieldValueProxy<TNode>)
  : never

interface DataPromise<T> extends Pick<Promise<T>, 'then' | 'catch'> {}

export type DataPromiseValue<T extends Node<any>> = T extends FieldsNode<
  any,
  any,
  any
>
  ? true
  : false

type NodeData<T> = DataPromise<T>

type FieldValueProxy<TNode extends FieldNode<any, any, any>> = DataProxy<
  InnerNode<TNode>
>

type FieldProxy<
  TNode extends FieldNode<any, any, any>
> = (TNode extends FieldNode<any, never, any>
  ? unknown
  : FieldCallback<TNode>) &
  FieldValueProxy<TNode>

type RecurseFields<TNode extends FieldsNode<any, any, any>> = {
  [K in keyof NodeDataType<TNode>]: FieldProxy<TNode['fields'][K]>
}

type RecurseArray<
  TNode extends ArrayNode<any, any>,
  DataType = NodeDataType<TNode>
> = {
  [K in keyof DataType]: K extends number
    ? DataProxy<TNode['ofNode']>
    : DataType[K]
}

export type DataProxy<TNode extends Node<any>> = TNode extends ArrayNode<
  any,
  any
>
  ? RecurseArray<TNode>
  : TNode extends FieldsNode<any, any, any>
  ? RecurseFields<TNode>
  : NodeData<NodeDataType<TNode>>
