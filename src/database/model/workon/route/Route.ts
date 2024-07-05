import { Schema, model, Types } from 'mongoose';
const { String, Boolean, ObjectId, Number } = Schema.Types;

export const DOCUMENT_NAME = 'Route';
export const COLLECTION_NAME = 'routes';

interface RouteMeta {
  // 菜单名称, 对应 locales文件夹中各语言 可选
  title?: string;
  // 菜单图标，可选
  icon?: string;
  // 菜单名称右侧的额外图标，可选
  extraIcon?: string;
  // 是否在菜单中显示,默认true，可选
  showLink?: boolean;
  // 是否显示父级菜单，可选
  showParent?: boolean;
  // 页面级别权限设置，可选
  roles?: Array<Types.ObjectId>;
  // 按钮级别权限设置
  auths?: Array<string>;
  // 所有可选按钮级别权限
  auths_options?: Array<string>;
  // 路由组件缓存, 默认关闭 false，可选
  keepAlive?: boolean;
  // 内嵌的iframe链接，可选
  frameSrc?: string;
  // iframe页是否开启首次加载动画（默认true，可选
  frameLoading?: boolean;
  // 页面加载动画（有两种形式，一种直接采用vue内置的transitions动画，另一种是使用animate.css写进、离场动画，可选
  transition?: {
    name?: string;
    // 进场动画
    enterTransition?: string;
    // 离场动画
    leaveTransition?: string;
  };
  // 是否不添加信息到标签页，（默认false）
  hiddenTag?: boolean;
  // 动态路由可打开的最大数量，可选
  dynamicLevel?: number;
  // 将某个菜单激活
  //（主要用于通过query或params传参的路由，当它们通过配置showLink: false后不在菜单中显示，就不会有任何菜单高亮，
  // 而通过设置activePath指定激活菜单即可获得高亮，activePath为指定激活菜单的path）
  activePath?: string;
  //排序
  rank?: number;
  //是否启用
  enabled: boolean;
}

export default interface Route {
  _id: Types.ObjectId;
  // 路由地址 必填
  path: string;
  // 路由名字（保持唯一，可选
  name?: string;
  // Layout组件，可选
  component?: string;
  // 路由重定向，可选
  redirect?: string;
  // meta
  meta: RouteMeta;

  parent?: Route; 
  createdAt?: Date;
  updatedAt?: Date;
}


const routeSchema = new Schema<Route>(
  {
    // 路由地址 必填
    path: {
      type: String,
      required: true,
      unique:true,
      trim: true, 
      index: true
    },
    // 路由名字（保持唯一，可选
    name: {
      type: String,
      unique:true,
      trim: true, 
      index: true,
      sparse: true
    },
    // 路由重定向，可选
    redirect: {
      type: String,
    },
    // Layout组件，可选
    component: {
      type: String,
    },
    meta:{
      title: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        required: false
      },
      // 菜单名称右侧的额外图标，可选
      extraIcon: {
        type: String,
      },
      // 是否在菜单中显示,默认true，可选
      showLink: {
        type: Boolean,
        default: true
      },
      // 是否显示父级菜单，可选
      showParent: {
        type: Boolean,
      },
      // 页面级别权限设置，可选
      // roles:{
      //   type: [ 
      //     {
      //       type: ObjectId,
      //       ref: 'Role',
      //       required: true,
      //     },
      //   ],
      //   default: () => { return null},
      //   required: false
      // },
      // 按钮级别权限设置，可选
      auths_options: {
        type:[{
          type:ObjectId,
          ref:'RouteAuth',
          required:true
        }],
        default: ()=> { return null },
        required: false
      },
      // 路由组件缓存, 默认关闭 false，可选
      keepAlive: {
        type: Boolean,
        default: false
      },
      // 内嵌的iframe链接，可选
      frameSrc: {
        type: String,
      },
      // iframe页是否开启首次加载动画（默认true，可选
      frameLoading: {
        type: Boolean,
        default: true
      },
      // 页面加载动画（有两种形式，一种直接采用vue内置的transitions动画，另一种是使用animate.css写进、离场动画，可选
      transition: {
        name: {
          type: String,
        },
        // 进场动画
        enterTransition: {
          type: String,
        },
        // 离场动画
        leaveTransition: {
          type: String,
        },
      },
      // 是否不添加信息到标签页，（默认false）
      hiddenTag: {
        type: Boolean,
        default: false
      },
      // 动态路由可打开的最大数量，可选
      dynamicLevel: {
        type: Number,
      },
      // 将某个菜单激活
      //（主要用于通过query或params传参的路由，当它们通过配置showLink: false后不在菜单中显示，就不会有任何菜单高亮，
      // 而通过设置activePath指定激活菜单即可获得高亮，activePath为指定激活菜单的path）
      activePath: {
        type: String,
      },
      enabled: {
        type: Boolean,
        default: false
      },
      rank:{
        type: Number
      }
    },
    // 子路由配置项
    parent: { 
      type: ObjectId, 
      ref:DOCUMENT_NAME, 
      default: null
    }
  },
  {
    versionKey: false,
    timestamps: true
  },
);

routeSchema.index({ path : 1 });
export const RouteModel = model<Route>(DOCUMENT_NAME, routeSchema, COLLECTION_NAME);