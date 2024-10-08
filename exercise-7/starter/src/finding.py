from gql.client import AsyncClientSession

from .gql import gql
from .analyze import Finding


async def create_finding(client: AsyncClientSession, finding: Finding):
    query = gql(
        """
        mutation CreateFinding($requestId: ID!, $input: CreateFindingInput!) {
            # CODE: Mutation to create a finding with requestId and input
        }
        """
    )
    description = "Found reflected parameters in reponse:\n"
    for key, value in finding.parameters:
        description += f"- {key}: {value}\n"

    finding = await client.execute(
        query,
        variable_values={
            "requestId": finding.id,
            "input": {
                "dedupeKey": "",  # CODE: Set the dedupeKey to a unique value,
                "description": "",  # CODE: Set the description to the description variable,
                "reporter": "Reflector",
                "title": "Reflected parameters",
            },
        },
    )

    if finding["createFinding"]["finding"]:
        print(f"[-] Created finding {finding['createFinding']['finding']['id']}")
