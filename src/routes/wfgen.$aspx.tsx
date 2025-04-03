import { createFileRoute } from "@tanstack/react-router";
import { Form } from "./-Form"

export const Route = createFileRoute("/wfgen/$aspx")({
    component: Form
});