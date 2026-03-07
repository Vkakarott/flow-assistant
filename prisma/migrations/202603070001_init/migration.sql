-- CreateTable
CREATE TABLE "flow_items" (
    "flow_code" TEXT NOT NULL,
    "id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "periodo_ideal" INTEGER NOT NULL,
    "pre_requisitos" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "carga_horaria" INTEGER NOT NULL,
    "creditos" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flow_items_pkey" PRIMARY KEY ("flow_code","id")
);

-- CreateTable
CREATE TABLE "user_flow_progress" (
    "user_identifier" TEXT NOT NULL,
    "flow_code" TEXT NOT NULL,
    "ingresso_ano" INTEGER NOT NULL,
    "ingresso_semestre" INTEGER NOT NULL,
    "periodo_offset" INTEGER NOT NULL DEFAULT 0,
    "concluidas" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "cursando" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_flow_progress_pkey" PRIMARY KEY ("user_identifier","flow_code")
);

