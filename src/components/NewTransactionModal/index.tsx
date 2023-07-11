import * as Dialog from "@radix-ui/react-dialog";
import {
  CloseButton,
  Content,
  Overley,
  TransactionType,
  TransactionTypeButton,
} from "./styles";
import { ArrowCircleDown, ArrowCircleUp, X } from "phosphor-react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionsContext } from "../../contexts/TransactionsContext";
import { useContextSelector } from "use-context-selector";
import { useState } from "react";

const newTransactionSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.string(),
  type: z.enum(["income", "outcome"]),
});

type NewTransactonFormInputs = z.infer<typeof newTransactionSchema>;

export function NewTransactionModal() {
  const [isOpen, setIsOpen] = useState(true); // Estado para controlar a exibição do modal

  const createTransaction = useContextSelector(
    TransactionsContext,
    (context) => {
      return context.createTransaction;
    }
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<NewTransactonFormInputs>({
    resolver: zodResolver(newTransactionSchema),
    defaultValues: {
      type: "income",
    },
  });

  async function handleCreateNewTransaction(data: NewTransactonFormInputs) {
    const { description, price, category, type } = data;

    await createTransaction({
      description,
      price,
      category,
      type,
    });

    reset();
    setIsOpen(false); // Fechar o modal após o envio do formulário
  }

  return (
    <Dialog.Portal>
      {isOpen && ( // Verificar se o modal deve ser exibido
        <>
          <Overley />

          <Content>
            <Dialog.Title>Nova transação</Dialog.Title>

            <CloseButton onClick={() => setIsOpen(false)}>
              {" "}
              {/* Adicionar ação para fechar o modal */}
              <X size={24} />
            </CloseButton>

            <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
              <input
                type="text"
                placeholder="Descrição"
                required
                {...register("description")}
              />
              <input
                type="number"
                placeholder="Preço"
                required
                {...register("price", { valueAsNumber: true })}
              />
              <input
                type="text"
                placeholder="Categoria"
                required
                {...register("category")}
              />

              <Controller
                control={control}
                name="type"
                render={({ field }) => {
                  return (
                    <TransactionType
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      //@ts-ignore
                      onValueChange={field.onChange}
                    >
                      <TransactionTypeButton variant="income" value="income">
                        <ArrowCircleUp size={24} />
                        Entrada
                      </TransactionTypeButton>

                      <TransactionTypeButton variant="outcome" value="outcome">
                        <ArrowCircleDown size={24} />
                        Saída
                      </TransactionTypeButton>
                    </TransactionType>
                  );
                }}
              />

              <button type="submit" disabled={isSubmitting}>
                Cadastrar
              </button>
            </form>
          </Content>
        </>
      )}
    </Dialog.Portal>
  );
}
