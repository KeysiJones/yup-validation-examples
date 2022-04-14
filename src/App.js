import "./App.css";
import React, { useEffect, useState } from "react";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

const Error = ({message}) => 
  <p className="text-red-400">
    {message}
    </p>

function App() {
  const [documentType, setDocumentType] = useState("CPF");
  let schema = yup.object().shape({
    nome: yup.string().required(),
    idade: yup.number().required().positive().integer(),
    cpf: yup.string().when('cnpj', (cnpj, schema) => {
      if((cnpj === '' || cnpj === undefined) && documentType === 'CPF') {
        return schema.required();
      }

      return schema;
    }),
    cnpj: yup.string().when('cpf', (cpf, schema) => {
      if((cpf === '' || cpf === undefined) && documentType === 'CNPJ') {
        return schema.required();
      }

      return schema;
    })
    // cpf: yup.string().when('cnpj', {
    //   is: (cnpj) => (cnpj === '' || cnpj === undefined) && documentType === 'CPF',
    //   then: yup.string().required(),
    //   otherwise: yup.string()
    // }),
    // cnpj: yup.string().when('cpf', {
    //   is: (cpf) => cpf === '' && documentType === 'CNPJ',
    //   then: yup.string().required(),
    //   otherwise: yup.string()
    // })
  }, ["cnpj", "cpf"])

  const { register, handleSubmit,watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
console.log(watch())
  useEffect(() => {
    console.log({errors})
  }, [errors])

  const onSubmit = data => console.log(data);
  
  return (
    <div className="h-screen">
      <div className="m-auto flex h-screen justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <label>Nome</label>
          <input type='text' className="mt-2 px-2 py-1 border-2 border-gray-300 rounded-md" {...register("nome")}></input>
        </div>
        <div className="flex flex-col mt-2">
          <label>Idade</label>
          <input type='number' className="border-2 px-2 py-1 mt-2 border-gray-300 rounded-md" {...register("idade")}></input>
        </div>
        <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} className="flex w-full mt-4 border-2 border-gray-800">
          <option value="CPF">CPF</option>
          <option value="CNPJ">CNPJ</option>
        </select>
        {
          documentType === 'CPF' ?
        <div className="flex flex-col">
          <label>CPF</label>
          <input type='text' placeholder="Informe o CPF" {...register("cpf")} className="mt-2 px-2 py-1 border-2 border-gray-300 rounded-md"></input>
        </div>
        :
        <div className="flex flex-col">
          <label>CNPJ</label>
          <input type='text' placeholder="Informe o CNPJ" {...register("cnpj")} className="mt-2 px-2 py-1 border-2 border-gray-300 rounded-md"></input>
        </div>
        }
        <button type="submit" className="mt-2 px-2 py-1 rounded-md bg-green-400 text-white">Enviar</button>
        {errors.idade && <Error message="Idade é obrigatório"/>}
        {errors.nome && <Error message="Nome é obrigatório"/>}
        {errors.cpf && <Error message="CPF é obrigatório"/>}
        {errors.cnpj && <Error message="CNPJ é obrigatório"/>}
      </form>
      </div>
    </div>
  );
}

export default App;
