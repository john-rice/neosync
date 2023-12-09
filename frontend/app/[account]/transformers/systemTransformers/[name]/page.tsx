'use client';
import { handleCustomTransformerForm } from '@/app/[account]/new/transformer/UserDefinedTransformerForms/HandleCustomTransformersForm';
import {
  SYSTEM_TRANSFORMER_SCHEMA,
  SystemTransformersSchema,
} from '@/app/[account]/new/transformer/schema';
import ButtonText from '@/components/ButtonText';
import OverviewContainer from '@/components/containers/OverviewContainer';
import PageHeader from '@/components/headers/PageHeader';
import { useAccount } from '@/components/providers/account-provider';
import { PageProps } from '@/components/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useGetSystemTransformers } from '@/libs/hooks/useGetSystemTransformers';
import { SystemTransformer } from '@/neosync-api-client/mgmt/v1alpha1/transformer_pb';
import { yupResolver } from '@hookform/resolvers/yup';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';

export default function ViewSystemTransformers({
  params,
}: PageProps): ReactElement {
  const { data: systemTransformers } = useGetSystemTransformers();

  const tName = params?.name ?? '';

  const currentTransformer = systemTransformers?.transformers.find(
    (item: SystemTransformer) => item.source == tName
  );

  const router = useRouter();
  const { account } = useAccount();

  const form = useForm<SystemTransformersSchema>({
    resolver: yupResolver(SYSTEM_TRANSFORMER_SCHEMA),
    defaultValues: {
      name: '',
      description: '',
      type: '',
      config: { config: { case: '', value: {} } },
    },
    values: {
      name: currentTransformer?.name ?? '',
      description: currentTransformer?.description ?? '',
      type: currentTransformer?.dataType ?? '',
      config: {
        config: {
          case: currentTransformer?.config?.config.case,
          value: currentTransformer?.config?.config.value ?? {},
        },
      },
    },
  });

  return (
    <OverviewContainer
      Header={
        <PageHeader
          header={currentTransformer?.name ?? 'System Transformer'}
          extraHeading={<NewTransformerButton />}
        />
      }
      containerClassName="px-12 md:px-24 lg:px-32"
    >
      <Form {...form}>
        <form className="space-y-8">
          <div>
            <FormField
              control={form.control}
              name="name"
              disabled={true}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormDescription>The Transformer name</FormDescription>
                  <FormControl>
                    <Input placeholder="Transformer Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-10">
              <FormField
                control={form.control}
                name="description"
                disabled={true}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormDescription>
                      The Transformer decription.
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="Transformer Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="pt-10">
              <FormField
                control={form.control}
                disabled={true}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormDescription>The Transformer type.</FormDescription>
                    <FormControl>
                      <Input placeholder="Transformer type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div>
            {handleCustomTransformerForm(currentTransformer?.source, true)}
          </div>
          <div className="flex flex-row justify-start">
            <Button
              type="button"
              onClick={() => router.push(`/${account?.name}/transformers`)}
            >
              Back
            </Button>
          </div>
        </form>
      </Form>
    </OverviewContainer>
  );
}

function NewTransformerButton(): ReactElement {
  const { account } = useAccount();
  return (
    <NextLink href={`/${account?.name}/new/transformer`}>
      <Button>
        <ButtonText text="Clone Transformer" />
      </Button>
    </NextLink>
  );
}