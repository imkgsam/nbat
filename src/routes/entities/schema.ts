import Joi from 'joi';
import { JoiObjectId, JoiUrlEndpoint } from '../../helpers/validator';

export default {
  Id: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  Employee: {
    idee: Joi.object().keys({
      entityId: JoiObjectId().required(),
      employeeId: JoiObjectId().required()
    }),
    ideeu: Joi.object().keys({
      entityId: JoiObjectId().required(),
      employeeId: JoiObjectId().required(),
      userId: JoiObjectId().required()
    }),
    create: Joi.object().keys({
      name: Joi.string().required().min(2),
      etype: Joi.string(),
      alias: Joi.string().min(2),
      scompany: JoiObjectId(),
      personal: {
        jobTitle: Joi.string(),
        sex: Joi.string(),
        birth: Joi.date()
      },
      common: {
        website: Joi.string(),
        email: Joi.string(),
        landline: Joi.string(),
        mobilePhone: Joi.string(),
        country: Joi.string(),
        city: Joi.string(),
        industry: Joi.string(),
        internalNote: Joi.string()
      },
      socialMedias: Joi.array().items(
        Joi.object().keys({
          key: Joi.string().required(),
          value: Joi.string().required()
        })
      ),
      meta: Joi.object().keys({
        enabled: Joi.boolean(),
        verified: Joi.boolean(),
        isSupplier: Joi.boolean(),
        isCustomer: Joi.boolean(),
        isEmployee: Joi.boolean(),
        isUser: Joi.boolean(),
      }),
      employee: Joi.object().keys({
        etype: Joi.string(),
        departments: Joi.array().items(JoiObjectId()),
        manager: JoiObjectId(),
        workPhone: Joi.string(),
        workMobile: Joi.string(),
        workEmail: Joi.string(),
        inaugurationDate: Joi.date(),
        probation: Joi.object().keys({
          isNeeded: Joi.boolean(),
          period: Joi.number(),
          startAt: Joi.date()
        }),
        privacy: Joi.object().keys({
          family: Joi.object().keys({
            status: Joi.string(),
            dependentChildrenCount: Joi.number().min(0)
          }),
          nationality: Joi.object().keys({
            country: Joi.string(),
            city: Joi.string(),
            birth: Joi.string(),
            ID: Joi.string(),
            passport: Joi.string(),
          }),
          emergency: Joi.object().keys({
            contact: Joi.string(),
            phone: Joi.string()
          })
        }),
        education: Joi.object().keys({
          qulification: Joi.string(),
          school: Joi.string(),
          graduatedAt: Joi.date(),
          major: Joi.string()
        }),
        meta: Joi.object().keys({
          enabled: Joi.boolean()
        })
      }),
      account: Joi.object().keys({
        accountName: Joi.string(),
        email: Joi.string(),
        phone: Joi.string(),
        password: Joi.string(),
        roles: Joi.array().items(JoiObjectId()),
        meta:{
          verified: Joi.boolean(),
          enabled: Joi.boolean()
        }
      }),
    }),
    update: Joi.object().keys({
      _id: JoiObjectId().required(),
      name: Joi.string().required().min(2),
      etype: Joi.string().required(),
      alias: Joi.string().min(2),
      scompany: JoiObjectId(),
      personal: {
        jobTitle: Joi.string(),
        sex: Joi.string(),
        birth: Joi.date()
      },
      common: {
        website: Joi.string(),
        email: Joi.string(),
        landline: Joi.string(),
        mobilePhone: Joi.string(),
        country: Joi.string(),
        city: Joi.string(),
        industry: Joi.string(),
        internalNote: Joi.string()
      },
      socialMedias: Joi.array().items(
        Joi.object().keys({
          key: Joi.string().required(),
          value: Joi.string().required()
        })
      ),
      meta: Joi.object().keys({
        enabled: Joi.boolean(),
        verified: Joi.boolean(),
        isSupplier: Joi.boolean(),
        isCustomer: Joi.boolean(),
        isEmployee: Joi.boolean(),
        isUser: Joi.boolean(),
      }),
      employee: Joi.object().keys({
        _id: JoiObjectId(),
        etype: Joi.string(),
        entity: JoiObjectId(),
        departments: Joi.array().items(JoiObjectId()),
        manager: JoiObjectId(),
        workPhone: Joi.string(),
        workMobile: Joi.string(),
        workEmail: Joi.string(),
        inaugurationDate: Joi.date(),
        probation: Joi.object().keys({
          isNeeded: Joi.boolean(),
          period: Joi.number(),
          startAt: Joi.date()
        }),
        EID: JoiObjectId(),
        ETL: Joi.string(),
        privacy: Joi.object().keys({
          family: Joi.object().keys({
            status: Joi.string(),
            dependentChildrenCount: Joi.number().min(0)
          }),
          nationality: Joi.object().keys({
            country: Joi.string(),
            city: Joi.string(),
            birth: Joi.string(),
            ID: Joi.string(),
            passport: Joi.string(),
          }),
          emergency: Joi.object().keys({
            contact: Joi.string(),
            phone: Joi.string()
          })
        }),
        education: Joi.object().keys({
          qulification: Joi.string(),
          school: Joi.string(),
          graduatedAt: Joi.date(),
          major: Joi.string()
        }),
        meta: Joi.object().keys({
          enabled: Joi.boolean()
        })
      }),
      account: Joi.object().keys({
        _id: JoiObjectId(),
        accountName: Joi.string(),
        email: Joi.string(),
        entity: JoiObjectId(),
        phone: Joi.string(),
        password: Joi.string(),
        roles: Joi.array().items(JoiObjectId()),
        meta:{
          verified: Joi.boolean(),
          enabled: Joi.boolean()
        }
      }),
    }),
    createUser: Joi.object().keys({
      entityId: JoiObjectId().required(),
      employeeId: JoiObjectId().required(),
      user: Joi.object().keys({
        accountName: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        roles: Joi.array().items(Joi.alternatives(JoiObjectId(), Joi.string()))
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
  Person: {
    create: Joi.object().keys({
      name: Joi.string().required().min(2),
      alias: Joi.string().min(2),
      scompany: JoiObjectId(),
      personal: {
        jobTitle: Joi.string(),
        sex: Joi.string(),
        birth: Joi.date()
      },
      common: {
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
  Company: {
    create: Joi.object().keys({
      name: Joi.string().required().min(2),
      alias: Joi.string().optional().min(2),
      enterprise: {
        manager: JoiObjectId().optional(),
        foundedAt: Joi.date().optional(),
        taxNum: Joi.string().optional()
      },
      common: {
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