import { db } from "@/lib/db";

import { getUserByEmail } from "./user";

export const getFormById = (id: string) => {
  return db.form.findUnique({
    where: { id },
    include: {
      sections: {
        include: {
          questions: {
            include: {
              options: true,
              responses: true,
            },
          },
        },
      },
      responses: {
        include: {
          answers: {
            include: {
              options: true,
            },
          },
        },
      },
    },
  });
};

export const getFormsByUserEmail = async (email: string) => {
  const user = await getUserByEmail(email);

  if (!user || !user.id) {
    return [];
  }

  console.log("user:", user);

  return db.form.findMany({
    where: {
      userId: user.id,
    },
  });
};

export const getFormWithAllResponsesByUser = async (
  formId: string,
  userId: string
) => {
  const responses = await db.response.findMany({
    where: {
      formId,
      userId,
    },
  });

  if (!responses) {
    return null;
  }

  const form = await db.form.findUnique({
    where: { id: formId },
    include: {
      sections: {
        include: {
          questions: {
            include: {
              options: true,
              responses: {
                where: {
                  responseId: {
                    in: responses.map((response) => response.id),
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        include: {
          answers: {
            include: {
              options: true,
            },
          },
        },
      },
    },
  });

  return form;
};

export const getFormWithResponseById = async (
  formId: string,
  responseId: string
) => {
  const response = await db.response.findUnique({
    where: { id: responseId },
    include: {
      answers: {
        include: {
          options: true,
        },
      },
    },
  });

  console.log(response);

  if (!response) {
    return null;
  }

  return db.form.findUnique({
    where: { id: formId },
    include: {
      sections: {
        include: {
          questions: {
            include: {
              options: true,
              responses: {
                where: {
                  responseId,
                },
                include: {
                  options: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const getALlResponsesForForm = (formId: string) => {
  return db.response.findMany({
    where: {
      formId,
    },
    include: {
      user: true,
    },
  });
};

export const getResponseById = (responseId: string) => {
  return db.response.findUnique({
    where: { id: responseId },
    include: {
      user: true,
    },
  });
};

export const getFormWithAllResponses = async (formId: string) => {
  return await db.form.findUnique({
    where: { id: formId },
    include: {
      sections: {
        include: {
          questions: {
            include: {
              options: true,
              responses: {
                include: {
                  options: true,
                },
              },
            },
          },
        },
      },
    },
  });
};
