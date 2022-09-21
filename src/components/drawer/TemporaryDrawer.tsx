import React from 'react'
import {Drawer} from "@mui/material";
import Box from "@mui/material/Box";
import {CopyBlock, nord} from "react-code-blocks";

export  function TemporaryDrawer({open, handleClose, element, dir="bottom"}) {


    return (
        <div className={'rounded-lg'}>
            <React.Fragment key={dir}>
                <Drawer
                    // @ts-expect-error TS(2322) FIXME: Type 'string' is not assignable to type '"bottom" ... Remove this comment to see the full error message
                    anchor={dir}
                    open={open}
                    onClose={handleClose}
                >
                    {element}
                </Drawer>
            </React.Fragment>
        </div>
    );
}

export function CodeResult({content, format}) {
    return (
        <Box sx={{
            padding: "10px",
            maxHeight: "400px"
        }}>
            <CopyBlock
                text={content}
                theme={nord}
                language={format}
                customStyle={
                    {
                        padding: "20px",
                        width: "100%",
                    }
                }
            />
        </Box>
    )
}
