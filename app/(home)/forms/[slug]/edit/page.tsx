"use client";

import React from "react";

import FormInputComponent from "@/components/form/form-input";

type Props = { params: { slug: string } };

const FormEditPage = ({ params }: Props) => {
  return <FormInputComponent formId={params.slug} />;
};

export default FormEditPage;
