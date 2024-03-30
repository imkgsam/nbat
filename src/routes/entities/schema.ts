import Joi from 'joi';
import { JoiObjectId, JoiUrlEndpoint } from '../../helpers/validator';

export default {
  Id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  Employee:{
    idee: Joi.object().keys({
      entityId: JoiObjectId().required(),
      employeeId: JoiObjectId().required()
    }),
    ideeu:Joi.object().keys({
      entityId: JoiObjectId().required(),
      employeeId: JoiObjectId().required(),
      userId: JoiObjectId().required()
    }),
    create: Joi.object().keys({
      employee: Joi.object().keys({
        etype: Joi.string().required(),
        departments: Joi.array().optional().items(JoiObjectId()),
        manager: JoiObjectId().optional(),
        workPhone: Joi.string().optional(),
        workMobile: Joi.string().optional(),
        workEmail: Joi.string().optional(),
        probation: Joi.object().optional().keys({
          isNeeded: Joi.boolean().optional(),
          period: Joi.number().optional(),
          startAt: Joi.date().optional()
        }),
        privacy: Joi.object().optional().keys({
          family: Joi.object().optional().keys({
            status: Joi.string().optional(),
            dependentChildrenCount: Joi.number().optional()
          }),
          nationality: Joi.object().optional().keys({
            country: Joi.string().optional(),
            city: Joi.string().optional(),
            birth: Joi.string().optional(),
            ID: Joi.string().optional(),
            passport: Joi.string().optional(),
          }),
          emergency:Joi.object().optional().keys({
            contact: Joi.string().optional(),
            phone: Joi.string().optional()
          })
        }),
        education:Joi.object().optional().keys({
          qulification: Joi.string().optional(),
          school: Joi.string().optional(),
          graduatedAt: Joi.date().optional()
        })
      }),
      entity: Joi.object().keys({
        name: Joi.string().required().min(2),
        alias: Joi.string().optional().min(2),
        personal:{
          jobTitle: Joi.string().optional(),
          sex: Joi.string().optional(),
          birth: Joi.date().optional()
        },
        common:{
          website: Joi.string().optional(),
          email: Joi.string().optional(),
          landline: Joi.string().optional(),
          mobilePhone: Joi.string().optional(),
          country: Joi.string().optional(),
          city: Joi.string().optional(),
          industry: Joi.string().optional(),
          internalNote: Joi.string().optional()
        },
        socialMedias: Joi.array().optional().items(
          Joi.object().keys({
            key: Joi.string().required(), 
            value: Joi.string().required()
          })
        )
      })
    }),
    createUser: Joi.object().keys({
      entityId: JoiObjectId().required(),
      employeeId: JoiObjectId().required(),
      user:Joi.object().keys({
        accountName: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        roles: Joi.array().items(Joi.alternatives(JoiObjectId(),Joi.string()))
      })
    }),
    filters: Joi.object().keys({
      currentPage: Joi.number(),
      pageSize: Joi.number(),
  
      filters: Joi.object().keys({
        name: Joi.string(),
        meta: Joi.object().keys({
          enabled: Joi.boolean(),
          verified: Joi.boolean(),
          isEmployee: Joi.boolean()
        })
      })
    }),
  },
  Person:{
    create: Joi.object().keys({
      name: Joi.string().required().min(2),
      alias: Joi.string().min(2),
      scompany: JoiObjectId(),
      personal:{
        jobTitle: Joi.string(),
        sex: Joi.string(),
        birth: Joi.date()
      },
      common:{
        website: Joi.string(),
        email: Joi.string(),
        landline: Joi.string(),
        mobilePhone: Joi.string(),
        country: Joi.string(),
        city: Joi.string(),
        industry: Joi.string(),
        internalNote: Joi.string()
      },
      socialMedias: Joi.array().optional().items(
        Joi.object().keys({
          key: Joi.string().required(), 
          value: Joi.string().required()
        })
      ),
      meta: Joi.object().keys({
        enabled: Joi.boolean(),
        verified: Joi.boolean(),
        isSupplier: Joi.boolean(),
        isCustomer: Joi.boolean()
      })
    }),
    filters: Joi.object().keys({
      currentPage: Joi.number(),
      pageSize: Joi.number(),
  
      filters: Joi.object().keys({
        code: Joi.string(),
        meta: Joi.object().keys({
          enabled: Joi.boolean(),
          verified: Joi.boolean()
        })
      })
    }),
  },
  Company:{
    create: Joi.object().keys({
      name: Joi.string().required().min(2),
      alias: Joi.string().optional().min(2),
      enterprise:{
        manager: JoiObjectId().optional(),
        foundedAt: Joi.date().optional(),
        taxNum: Joi.string().optional()
      },
      common:{
        website: Joi.string().optional(),
        email: Joi.string().optional(),
        landline: Joi.string().optional(),
        mobilePhone: Joi.string().optional(),
        country: Joi.string().optional(),
        city: Joi.string().optional(),
        industry: Joi.string().optional(),
        internalNote: Joi.string().optional()
      },
      socialMedias: Joi.array().optional().items(
        Joi.object().keys({
          key: Joi.string().required(), 
          value: Joi.string().required()
        })
      )
    }),
    filters: Joi.object().keys({
      currentPage: Joi.number(),
      pageSize: Joi.number(),
  
      filters: Joi.object().keys({
        code: Joi.string(),
        meta: Joi.object().keys({
          enabled: Joi.boolean(),
          verified: Joi.boolean()
        })
      })
    }),
  }
};