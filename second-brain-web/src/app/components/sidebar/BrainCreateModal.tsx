"use client";

import * as React from "react";
import { startTransition, useActionState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import * as actions from "@/actions"; // export async function CreateBrain(prev, formData){...}

type CreateState = {
  success?: boolean;
  errors?: { name?: string[]; _form?: string[]; description?: string[] };
};

const INITIAL: CreateState = { success: false, errors: {} };

export function BrainCreateModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [state, formAction, pending] = useActionState(
    actions.CreateBrainForUser as any,
    INITIAL
  );
  console.log(state);

  /** Submit the brain creation form via server action. */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
  

    startTransition(() => {
      // @ts-ignore
      formAction(formData);
    });
  }

  /** Reset form state when closing and toggle modal. */
  const handleOpenChange = () => {
    startTransition(() => {
      // @ts-ignore
      formAction(null);
    });
    onOpenChange();
  };

  return (
    <>
      <Button  className="ml-2" color="secondary" onPress={onOpen}>Add Brain</Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        placement="center"
        backdrop="blur"
        isDismissable={!pending}
        hideCloseButton={pending}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Enter brain name</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                  <Input
                    name="name"
                    label="Name"
                    variant="bordered"
                    isDisabled={pending}
                    isInvalid={!!state?.errors?.name}
                    errorMessage={state?.errors?.name?.join(", ")}
                  />
                  <Textarea
                    name="description"
                    label="Description"
                    variant="bordered"
                    isDisabled={pending}
                    isInvalid={!!state?.errors?.name}
                    errorMessage={state?.errors?.name?.join(", ")}
                  />
                  {state?.errors?._form && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-1">
                      <p className="text-sm text-red-800">
                        {state.errors._form?.join(", ")}
                      </p>
                    </div>
                  )}
                  {state?.success && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-1">
                      <p className="text-sm text-green-800">
                        Brain created successfully
                      </p>
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="flat"
                      onPress={() => handleOpenChange()}
                      isDisabled={pending}
                    >
                      Close
                    </Button>
                    <Button color="secondary" type="submit" isLoading={pending}>
                      Create
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
