import{
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
}from './breadcrumb';

import{ useBreadcrumb } from '../../context/BreadcrumbContext';

export function AppBreadcrumb(){
    const {state} = useBreadcrumb();

    return(
        <Breadcrumb>
            {state.items.map((item, index) => (
                <BreadcrumbItem key={index}>
                    <BreadcrumbLink href={item.url}>
                        {item.title}
                    </BreadcrumbLink>
                    {index < state.items.length - 1 && <BreadcrumbSeparator />}
                </BreadcrumbItem>
            ))}
            <BreadcrumbPage>{state.items[state.items.length - 1].title}</BreadcrumbPage>
        </Breadcrumb>
    );
}