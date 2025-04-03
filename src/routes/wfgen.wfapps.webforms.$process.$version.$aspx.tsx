import { createFileRoute } from "@tanstack/react-router";
import { Form } from "./-Form";

export const Route = createFileRoute("/wfgen/wfapps/webforms/$process/$version/$aspx")({
    component: Form
});